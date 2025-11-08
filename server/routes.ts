import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import OpenAI from "openai";
import { messageSchema } from "@shared/schema";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const conversationScripts: Record<string, string> = {
  "car-loan": `You are Eylin, a friendly AI loan assistant helping with car loans. Follow this conversation flow:
1. Greet warmly and ask about their dream car
2. Ask about their budget and income
3. Ask for employment details (salaried/self-employed)
4. Request documents: PAN card, Aadhaar, salary slips/ITR, bank statements
5. After receiving documents, congratulate them and inform them their loan is being processed
6. Keep responses brief, warm, and professional. Use simple language. Add a relevant emoji occasionally.`,

  "education-loan": `You are Eylin, a friendly AI loan assistant helping with education loans. Follow this conversation flow:
1. Greet warmly and ask about their educational plans
2. Ask about the course, institution, and total fees
3. Ask about the student's current education level and percentage
4. Request documents: PAN card, Aadhaar, admission letter, fee structure, academic transcripts
5. After receiving documents, congratulate them and inform them their loan is being processed
6. Keep responses brief, warm, and professional. Use simple language. Add a relevant emoji occasionally.`,

  "business-loan": `You are Eylin, a friendly AI loan assistant helping with business loans. Follow this conversation flow:
1. Greet warmly and ask about their business
2. Ask about business type, years in operation, and monthly revenue
3. Ask what they need the loan for (expansion, equipment, working capital)
4. Request documents: PAN card, Aadhaar, GST registration, bank statements, ITR for last 2 years
5. After receiving documents, congratulate them and inform them their loan is being processed
6. Keep responses brief, warm, and professional. Use simple language. Add a relevant emoji occasionally.`,

  "two-wheeler-loan": `You are Eylin, a friendly AI loan assistant helping with two-wheeler loans. Follow this conversation flow:
1. Greet warmly and ask which bike/scooter they're interested in
2. Ask about their income and employment status
3. Ask if they have any existing loans
4. Request documents: PAN card, Aadhaar, salary slips, bank statements
5. After receiving documents, congratulate them and inform them their loan is being processed
6. Keep responses brief, warm, and professional. Use simple language. Add a relevant emoji occasionally.`,

  "home-improvement": `You are Eylin, a friendly AI loan assistant helping with home improvement loans. Follow this conversation flow:
1. Greet warmly and ask what home improvements they're planning
2. Ask about the estimated cost and their monthly income
3. Ask about property ownership (own/rented)
4. Request documents: PAN card, Aadhaar, property documents, salary slips, bank statements
5. After receiving documents, congratulate them and inform them their loan is being processed
6. Keep responses brief, warm, and professional. Use simple language. Add a relevant emoji occasionally.`,

  "personal-loan": `You are Eylin, a friendly AI loan assistant helping with personal loans. Follow this conversation flow:
1. Greet warmly and ask what they need the loan for
2. Ask about the loan amount they need and their monthly income
3. Ask about their employment status and any existing loans
4. Request documents: PAN card, Aadhaar, salary slips, bank statements
5. After receiving documents, congratulate them and inform them their loan is being processed
6. Keep responses brief, warm, and professional. Use simple language. Add a relevant emoji occasionally.`,

  "other-loan": `You are Eylin, a friendly AI loan assistant helping explore loan options. Follow this conversation flow:
1. Greet warmly and ask what kind of loan they're looking for
2. Understand their specific needs and financial situation
3. Suggest the most appropriate loan type based on their needs
4. Ask relevant questions based on the loan type they need
5. Request appropriate documents
6. After receiving documents, congratulate them and inform them their loan is being processed
7. Keep responses brief, warm, and professional. Use simple language. Add a relevant emoji occasionally.`,
};

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/conversations", async (req, res) => {
    try {
      const { loanType } = req.body;
      
      if (!loanType) {
        return res.status(400).json({ error: "loanType is required" });
      }

      const conversation = await storage.createConversation({
        loanType,
        applicantName: null,
        messages: [],
      });

      const script = conversationScripts[loanType] || conversationScripts["other-loan"];
      
      const initialMessage = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: script },
          { role: "user", content: "Start the conversation" },
        ],
        temperature: 0.7,
        max_tokens: 150,
      });

      const aiResponse = initialMessage.choices[0]?.message?.content || "Hello! How can I help you today?";
      
      const message = {
        text: aiResponse,
        isUser: false,
        timestamp: new Date().toISOString(),
      };

      await storage.addMessage(conversation.id, message);

      return res.json({ conversationId: conversation.id, message });
    } catch (error) {
      console.error("Error creating conversation:", error);
      return res.status(500).json({ error: "Failed to create conversation" });
    }
  });

  app.post("/api/conversations/:id/messages", async (req, res) => {
    try {
      const { id } = req.params;
      const { text } = req.body;

      if (!text) {
        return res.status(400).json({ error: "text is required" });
      }

      const conversation = await storage.getConversation(id);
      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }

      const userMessage = {
        text,
        isUser: true,
        timestamp: new Date().toISOString(),
      };
      await storage.addMessage(id, userMessage);

      const messages = Array.isArray(conversation.messages) ? conversation.messages : [];
      const script = conversationScripts[conversation.loanType] || conversationScripts["other-loan"];

      const openaiMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
        { role: "system", content: script },
        ...messages.map((msg: any) => ({
          role: msg.isUser ? "user" as const : "assistant" as const,
          content: msg.text,
        })),
        { role: "user", content: text },
      ];

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: openaiMessages,
        temperature: 0.7,
        max_tokens: 200,
      });

      const aiResponse = completion.choices[0]?.message?.content || "I'm here to help. Could you provide more details?";

      const aiMessage = {
        text: aiResponse,
        isUser: false,
        timestamp: new Date().toISOString(),
      };
      await storage.addMessage(id, aiMessage);

      return res.json({ message: aiMessage });
    } catch (error) {
      console.error("Error sending message:", error);
      return res.status(500).json({ error: "Failed to send message" });
    }
  });

  app.get("/api/conversations/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const conversation = await storage.getConversation(id);
      
      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }

      return res.json(conversation);
    } catch (error) {
      console.error("Error getting conversation:", error);
      return res.status(500).json({ error: "Failed to get conversation" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
