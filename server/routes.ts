import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { messageSchema } from "@shared/schema";

// OSO Authorization Framework (commented for demo - install with: npm install oso)
// import { Oso } from "oso";
// import { initializeOSOPolicies, checkPermission, authorizeLoanAccess } from "./oso-config";

// AI Agents Framework (commented for demo - install with: npm install langchain)
// import { Agent, AgentExecutor } from "langchain/agents";
// import { OpenAI } from "langchain/llms/openai";
// import { ChatOpenAI } from "langchain/chat_models/openai";
// import { loanAgent, LoanProcessingAgent } from "./ai-agents";

// Ethereum/Web3 Integration (commented for demo - install with: npm install ethers web3)
// import { ethers } from "ethers";
// import Web3 from "web3";
// import { Contract, JsonRpcProvider } from "ethers";
// import { ethereumService, EthereumLoanService, web3Utils } from "./ethereum-service";

// Fixed demo conversations based on the system prompt
const fixedConversations: Record<string, Array<{userMessage: string, aiResponse: string}>> = {
  "car-loan": [
    {
      userMessage: "START_CONVERSATION",
      aiResponse: "Hi there! 🚗 That's exciting. Could you share  how much you're looking to borrow for your car?"
    },
    {
      userMessage: "Around 7 lakh rupees.",
      aiResponse: "Your monthly income range? "
    },
    {
      userMessage: "Around ₹85,000 per month.",
      aiResponse: "Great ! Let's proceed with your KYC. Could you please upload your PAN Card and Salary Slip (last 3 months)?"
    },
    {
      userMessage: "DOCUMENTS_SUBMITTED",
      aiResponse: "Thanks! Let me verify your documents... ⏳\n\nPlease wait while I process your information."
    },
    {
      userMessage: "USER_CONTINUES_AFTER_VERIFICATION",
      aiResponse: "✅ Verification complete!\n\nYour credit score looks great at 760, and you're eligible for our Car Loan Offer:\n\n💰 Amount: ₹7,00,000\n📈 Interest Rate: 10.5% per annum\n📅 Tenure: 48 months\n💳 Monthly EMI: ₹17,456\n\nWould you like me to generate your sanction letter?"
    },
    {
      userMessage: "Yes, please.",
      aiResponse: "🎉 Congratulations, Nitish! Your car loan has been approved.\n\n📄 **Your Digital Sanction Letter is Ready!**\n\n[Download Sanction Letter](DOWNLOAD_LINK)\n\nYour loan reference number is: CAR-LOAN-2024\nNext steps: Our team will contact you within 24 hours for disbursement."
    }
  ],
  "education-loan": [
    {
      userMessage: "START_CONVERSATION",
      aiResponse: "Hey! 👋 That's awesome — investing in Data Science is a great move. Which institute or course are you enrolling in?"
    },
    {
      userMessage: "Data Science PG Program at Great Learning.",
      aiResponse: "Great choice , how much is your total course fee?"
    },
    {
      userMessage: "Around ₹4 lakh.",
      aiResponse: "Got it. Since you're applying as a student, I'll also need your parent or guardian's monthly income for the underwriting check."
    },
    {
      userMessage: "Around ₹50,000.",
      aiResponse: "Thanks! We're almost there — could you please upload your Admission Letter and your parent's ITR or Salary Slip?"
    },
    {
      userMessage: "DOCUMENTS_SUBMITTED",
      aiResponse: "Perfect! Let me review your documents... 📄⏳\n\nVerifying admission details and income documents..."
    },
    {
      userMessage: "USER_CONTINUES_AFTER_VERIFICATION",
      aiResponse: "✅ Verification complete!\n\nYour credit score is 720, which meets our requirements, and your parent's income is stable.\n\n🎓 Education Loan Approved!\n\n💰 Amount: ₹4,00,000\n📈 Interest Rate: 11.0% per annum\n📅 Tenure: 60 months\n💳 Monthly EMI: ₹8,333\n\nWould you like me to generate your sanction letter?"
    },
    {
      userMessage: "Yes!",
      aiResponse: "🎉 Congratulations! Your education loan has been approved.\n\n📄 **Your Digital Sanction Letter is Ready!**\n\n[Download Sanction Letter](DOWNLOAD_LINK)\n\nYour loan reference number is: EDU-LOAN-2024\nNext steps: Submit this letter to your institution for fee payment."
    }
  ],
  "education-loan-escalation": [
    {
      userMessage: "Hi, I'd like to apply for an education loan for my postgraduate course.",

      aiResponse: "Sure Nitish! Which course or institute are you joining?"
    },
    {
      userMessage: "Data Science program at IIST Kolkata",
      aiResponse: "Excellent choice — that's one of our partnered institutions. 🎓\n\nHow much loan amount do you require for the course?"
    },
    {
      userMessage: "Around ₹4,00,000.",
      aiResponse: "Got it. And what's your parent's or guardian's monthly income?"
    },
    {
      userMessage: "Around ₹50,000.",
      aiResponse: "Perfect, thanks! We'll just need your parent's salary slip or ITR to confirm the co-applicant's eligibility. Could you upload it here?"
    },
    {
      userMessage: "Actually, my dad is self-employed and doesn't file ITR.",
      aiResponse: "That's completely okay, Nitish! 😊\n\nMany self-employed applicants face the same situation — we can still help.\n\nTo process this type of case, a loan officer needs to manually verify your parent's income proof through alternate documents (like bank statements or a self-declaration).\n\nI'll now connect your application to our Education Loan Officer, who'll guide you on the next steps.\n\nYou'll receive a call or WhatsApp message from them in about 2 hours."
    },
    {
      userMessage: "Oh okay, thank you so much!",
      aiResponse: "You're very welcome! Don't worry — your loan journey will continue smoothly. We'll take it from here. 🎓💙"
    }
  ],
  "business-loan": [
    {
      userMessage: "Hi, I want a business loan to expand my food manufacturing unit.",
      aiResponse: "That's great to hear! 🍲 Could you please share your business name and loan amount you're seeking?"
    },
    {
      userMessage: "Arjun Foods Pvt. Ltd. — I need around ₹40 lakhs.",
      aiResponse: "Excellent. Before proceeding, I'll need your Business PAN and GST Return for verification. Could you upload them here?"
    },
    {
      userMessage: "Sure, uploading both now.",
      aiResponse: "Thanks! Let me quickly verify your documents...\n\ \n\nHmm, it looks like your PAN is registered under Arjun Food Products LLP, while your GST return lists Arjun Foods Pvt. Ltd..\n\nThis could be due to a recent business structure change, which is completely normal — nothing to worry about. 👍\n\nHowever, such cases need a quick manual review for compliance purposes.\n\nI'll now forward your application to our Compliance Verification Team.\n\nThey'll verify the business transition and approve your documentation, usually within 24 hours."
    },
    {
      userMessage: "Oh okay, does that mean my application is on hold?",
      aiResponse: "Not exactly — it's just pending manual verification. Your request for ₹40 lakh will continue right after compliance clearance."
    },
    {
      userMessage: "Got it. Thanks for updating me.",
      aiResponse: "My pleasure, Arjun! 💼 You'll receive a confirmation email once your documents are verified.\n\nWe'll ensure your expansion plan stays on schedule. 🚀"
    }
  ],
  "skill-course-loan": [
    {
      userMessage: "Hi, I'm looking for a small loan to join a graphic-design course.",
      aiResponse: "Hey Nitish! 🎨 That's awesome — upskilling is always a smart move. How much would you like to borrow for the course?"
    },
    {
      userMessage: "Around ₹7 000.",
      aiResponse: "Perfect! Since this is a micro-loan, I'll check a few simple details. Could you please upload your Aadhaar and a recent electricity bill as address proof?"
    },
    {
      userMessage: "Done.",
      aiResponse: "Thanks, Nitish! ✅ Everything looks good. You're eligible for ₹7 000 at 12.5 % for 12 months. Would you like me to generate your sanction letter?"
    },
    {
      userMessage: "Yes, please.",
      aiResponse: "🎉 Congratulations, Nitish! Your skill-development loan has been approved.\n\n📄 **Your Digital Sanction Letter is Ready!**\n\n[Download Sanction Letter](DOWNLOAD_LINK)\n\nYour loan reference number is: SKILL-LOAN-2024"
    }
  ],
  "rent-deposit-loan": [
    {
      userMessage: "Hi, I need a loan to pay rent for the flat I'm staying in Pune",
      aiResponse: " I can help you with that. What amount are you looking for ?"
    },
    {
      userMessage: "Yes, ₹10 000.",
      aiResponse: "Great! Please upload your offer letter or first salary slip so I can confirm your employment status."
    },
    {
      userMessage: "Uploaded.",
      aiResponse: "Perfect — verified successfully. Based on your income details, you're approved for ₹10 000 at 13 % for 10 months. Would you like me to create your repayment plan and sanction letter?"
    },
    {
      userMessage: "Sure.",
      aiResponse: "🎉 Done! Your rent-support loan is ready, Nitish.\n\n📄 **Your Digital Sanction Letter is Ready!**\n\n[Download Sanction Letter](DOWNLOAD_LINK)\n\nYour loan reference number is: RENT-LOAN-2024\nYou're all set for your new place!"
    }
  ],
  "digital-credit-loan": [
    {
      userMessage: "Hi Eylin, I've never taken a loan before — can I still apply?",
      aiResponse: "Absolutely, Nitish! 🌱 That's exactly what this track is for. We look at your digital activity like bill payments and UPI usage to get a simple credit picture. Could you please upload your Aadhaar and any recent mobile bill?"
    },
    {
      userMessage: "Done.",
      aiResponse: "Thanks ✅ Everything checks out. You're eligible for ₹6 000 at 12 % for 9 months. Paying this loan on time will build your first credit score. Would you like to proceed?"
    },
    {
      userMessage: "Yes!",
      aiResponse: "🎉 Great news, Nitish — you've officially started your credit journey!\n\n📄 **Your Digital Sanction Letter is Ready!**\n\n[Download Sanction Letter](DOWNLOAD_LINK)\n\nYour loan reference number is: CREDIT-LOAN-2024\nThis will help build your first credit score!"
    }
  ],
  "small-business-loan": [
    {
      userMessage: "START_CONVERSATION",
      aiResponse: "That's wonderful, Nitish! 🔥 Supporting local businesses is what this program is about. Could you upload a screenshot of your last month's UPI sales or daily transaction summary?"
    },
    {
      userMessage: "Uploaded.",
      aiResponse: "Thanks! Let me review your transaction records...\n\n(\n\nI see that your UPI transactions show some inconsistencies in the daily sales pattern, and the total monthly volume is slightly below our standard threshold for automatic approval.\n\nThis is completely normal for small businesses — we can still help! 😊\n\nTo process this type of case, a loan officer needs to manually verify your business income through alternate documents (like bank statements or a detailed sales register).\n\nI'll now connect your application to our Small Business Loan Officer, who'll guide you on the next steps.\n\nYou'll receive a call or WhatsApp message from them in about 2 hours."
    },
    {
      userMessage: "Oh okay, thank you so much!",
      aiResponse: "You're very welcome, Nitish! Don't worry — your loan journey will continue smoothly. We'll take it from here. 🔥💙"
    }
  ]
};

// Helper to get current user from session
function getCurrentUser(req: any) {
  return req.session?.userId ? { id: req.session.userId, username: req.session.username, fullName: req.session.fullName } : null;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/register", async (req: any, res: any) => {
    try {
      const { username, password, fullName, email, age, occupation, phone, address } = req.body;
      
      if (!username || !password || !fullName || !email || !age || !occupation) {
        return res.status(400).json({ error: "Username, password, full name, email, age, and occupation are required" });
      }

      const user = await storage.createUser({
        username,
        password,
        fullName,
        email,
        age,
        occupation,
        phone: phone || null,
        address: address || null,
      });

      // Set session
      req.session.userId = user.id;
      req.session.username = user.username;
      req.session.fullName = user.fullName;

      // Don't send password back
      const { password: _, ...userWithoutPassword } = user;
      return res.json({ user: userWithoutPassword });
    } catch (error: any) {
      console.error("Error registering user:", error);
      if (error.message === "Username already exists") {
        return res.status(409).json({ error: "Username already exists" });
      }
      return res.status(500).json({ error: "Failed to register user" });
    }
  });

  app.post("/api/auth/login", async (req: any, res: any) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
      }

      const user = await storage.verifyPassword(username, password);
      
      if (!user) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      // Set session
      req.session.userId = user.id;
      req.session.username = user.username;
      req.session.fullName = user.fullName;

      // Don't send password back
      const { password: _, ...userWithoutPassword } = user;
      return res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Error logging in:", error);
      return res.status(500).json({ error: "Failed to login" });
    }
  });

  app.post("/api/auth/logout", async (req: any, res: any) => {
    req.session.destroy((err: any) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res.status(500).json({ error: "Failed to logout" });
      }
      return res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", async (req: any, res: any) => {
    const user = getCurrentUser(req);
    if (!user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    const fullUser = await storage.getUser(user.id);
    if (!fullUser) {
      return res.status(404).json({ error: "User not found" });
    }
    
    const { password: _, ...userWithoutPassword } = fullUser;
    return res.json({ user: userWithoutPassword });
  });

  app.post("/api/conversations", async (req: any, res: any) => {
    try {
      const { loanType } = req.body;
      
      console.log(`Creating conversation with loanType: "${loanType}"`);
      console.log(`Available loan types: ${Object.keys(fixedConversations).join(', ')}`);
      
      if (!loanType) {
        return res.status(400).json({ error: "loanType is required" });
      }

      // Check if loanType exists in fixedConversations
      if (!fixedConversations[loanType]) {
        console.error(`Loan type "${loanType}" not found in fixedConversations`);
        return res.status(400).json({ error: `Invalid loan type: ${loanType}` });
      }

      // Get current user's full name from session
      const currentUser = getCurrentUser(req);
      const applicantName = currentUser?.fullName || null;

      const conversation = await storage.createConversation({
        loanType,
        applicantName,
        messages: [],
      });

      console.log(`Conversation created with ID: ${conversation.id}, loanType: "${conversation.loanType}"`);

      // ABSOLUTELY NO MESSAGE SENT ON CREATION - Wait for user to send the first message
      console.log("NOT sending any initial message - waiting for user input");
      return res.json({ conversationId: conversation.id, message: null });
    } catch (error) {
      console.error("Error creating conversation:", error);
      return res.status(500).json({ error: "Failed to create conversation" });
    }
  });

  app.post("/api/conversations/:id/messages", async (req: any, res: any) => {
    try {
      const { id } = req.params;
      const { text } = req.body;

      if (!text) {
        return res.status(400).json({ error: "text is required" });
      }

      const conversation = await storage.getConversation(id);
      if (!conversation) {
        console.error(`Conversation not found for ID: ${id}`);
        return res.status(404).json({ error: "Conversation not found" });
      }

      console.log(`Retrieved conversation - ID: ${conversation.id}, loanType: "${conversation.loanType}"`);

      const userMessage = {
        text,
        isUser: true,
        timestamp: new Date().toISOString(),
      };
      const updatedConversation = await storage.addMessage(id, userMessage);
      
      if (!updatedConversation) {
        console.error(`Failed to add message to conversation ID: ${id}`);
        return res.status(404).json({ error: "Conversation not found" });
      }

      // Get fixed conversation flow
      // Check if loanType exists and is valid
      if (!updatedConversation.loanType) {
        console.error(`Conversation has no loanType! Conversation:`, JSON.stringify(updatedConversation, null, 2));
        const aiMessage = {
          text: "I only handle approved loan conversations. Please choose a valid loan type or return to the main menu.",
          isUser: false,
          timestamp: new Date().toISOString(),
        };
        await storage.addMessage(id, aiMessage);
        return res.json({ message: aiMessage });
      }

      const loanType = String(updatedConversation.loanType).trim();
      console.log(`Looking for loanType: "${loanType}"`);
      console.log(`Available loan types: ${Object.keys(fixedConversations).join(', ')}`);
      console.log(`Type of loanType: ${typeof loanType}, Length: ${loanType.length}`);
      console.log(`Conversation keys:`, Object.keys(updatedConversation));
      
      // Check for escalation patterns in user message and switch to escalation flow
      let actualLoanType = loanType;
      const userTextLower = text.toLowerCase().trim();
      
      // Detect education loan escalation pattern
      if (loanType === "education-loan" && 
          (userTextLower.includes("postgraduate course") || 
           userTextLower.includes("self-employed") ||
           userTextLower.includes("doesn't file itr") ||
           userTextLower.includes("does not file itr") ||
           userTextLower.includes("no itr"))) {
        actualLoanType = "education-loan-escalation";
        console.log(`Detected escalation pattern: switching from "${loanType}" to "${actualLoanType}"`);
      }
      
      // Add more escalation patterns here as needed
      // Example: business loan escalation, personal loan escalation, etc.
      
      const fixedConversation = fixedConversations[actualLoanType];
      if (!fixedConversation) {
        console.error(`No fixed conversation found for loanType: "${actualLoanType}"`);
        console.error(`Original loanType was: "${loanType}"`);
        console.error(`Conversation object:`, JSON.stringify(updatedConversation, null, 2));
        console.error(`Trying exact match check:`, fixedConversations.hasOwnProperty(actualLoanType));
        console.error(`Checking each key:`, Object.keys(fixedConversations).map(k => `"${k}" === "${actualLoanType}": ${k === actualLoanType}`));
        const aiMessage = {
          text: "I only handle approved loan conversations. Please choose a valid loan type or return to the main menu.",
          isUser: false,
          timestamp: new Date().toISOString(),
        };
        await storage.addMessage(id, aiMessage);
        return res.json({ message: aiMessage });
      }

      // Count user messages to determine which response to give
      const messages = Array.isArray(updatedConversation.messages) ? updatedConversation.messages : [];
      const userMessageCount = messages.filter((msg: any) => msg.isUser).length;
      const allMessages = messages.filter((msg: any) => !msg.isUser); // AI messages
      
      // Check if we just sent a verification message
      const lastAiMessage = allMessages.length > 0 ? allMessages[allMessages.length - 1] : null;
      const isAwaitingVerificationContinue = lastAiMessage && 
        (lastAiMessage.text.includes('verify') || lastAiMessage.text.includes('process') || lastAiMessage.text.includes('⏳'));
      
      // Handle special document submission keywords
      let userText = text.toLowerCase().trim();
      let responseIndex = 0; // Start from the first AI response in the conversation flow
      let aiResponse = "I only handle approved loan conversations. Please choose a valid loan type or return to the main menu.";
      
      // Check if we've already processed documents (avoid loops)
      const hasProcessedDocuments = allMessages.some((msg: any) => 
        msg.text && (msg.text.includes('Verification complete') || msg.text.includes('approved') || msg.text.includes('sanction letter'))
      );
      
      // Special handling for escalation scenarios
      if (actualLoanType === "education-loan-escalation" && 
          (userText.includes("self-employed") || userText.includes("doesn't file itr") || userText.includes("no itr"))) {
        // If user mentions self-employment issues, go directly to the escalation response
        for (let i = 0; i < fixedConversation.length; i++) {
          if (fixedConversation[i].userMessage === "Actually, my dad is self-employed and doesn't file ITR.") {
            responseIndex = i;
            break;
          }
        }
      }
      // For the first user message, always give the first AI response (START_CONVERSATION)
      else if (userMessageCount === 1) {
        // Find the START_CONVERSATION entry or use index 0
        for (let i = 0; i < fixedConversation.length; i++) {
          if (fixedConversation[i].userMessage === "START_CONVERSATION") {
            responseIndex = i;
            break;
          }
        }
        if (responseIndex === 0 && fixedConversation[0].userMessage !== "START_CONVERSATION") {
          responseIndex = 0; // Fallback to first response
        }
      }
      // Check for document submission patterns - only if not already processed
      else if (!hasProcessedDocuments && (userText.includes('document') || userText.includes('upload') || 
          userText.includes('submit') || userText.includes('done') || userText.includes('uploaded') || 
          userText.includes('attach'))) {
        // Special handling for small-business-loan - go to escalation response
        if (actualLoanType === "small-business-loan") {
          responseIndex = 1; // Go to the second response (escalation)
        } else {
          // For other loan types, go directly to final approval after document submission
          for (let i = 0; i < fixedConversation.length; i++) {
            if (fixedConversation[i].userMessage === "USER_CONTINUES_AFTER_VERIFICATION") {
              responseIndex = i;
              break;
            }
          }
        }
      } else if (hasProcessedDocuments) {
        // If documents already processed and user sends another message, end conversation politely
        responseIndex = -1; // Skip the normal response logic
        aiResponse = "Thank you! Your loan application is now complete. Please download sanction letter.\n\n📄 **Download Your Official Sanction Letter**\n\n[Download Sanction Letter](DOWNLOAD_LINK)";
      } else {
        // Sequential flow: 2nd user message gets 1st AI response, 3rd gets 2nd, etc.
        // But for small-business-loan, handle the limited conversation flow
        if (actualLoanType === "small-business-loan") {
          // Small business loan has only 3 responses, so limit the index
          responseIndex = Math.min(userMessageCount - 1, fixedConversation.length - 1);
        } else {
          responseIndex = userMessageCount - 1;
        }
      }
      
      // Debug: Log the loanType and userMessageCount
      console.log(`Original Loan Type: ${loanType}, Actual Loan Type: ${actualLoanType}, User Message Count: ${userMessageCount}, Response Index: ${responseIndex}, Fixed Conversation Length: ${fixedConversation.length}`);
      console.log(`Is Awaiting Verification Continue: ${isAwaitingVerificationContinue}`);
      console.log(`User Text: "${userText}"`);
      console.log(`Last AI Message: "${lastAiMessage?.text || 'none'}"`);
      console.log(`Has Processed Documents: ${hasProcessedDocuments}`);
      
      // Handle special case where documents already processed
      if (responseIndex === -1) {
        // Replace download link placeholder in completion message too
        if (aiResponse.includes('DOWNLOAD_LINK')) {
          const downloadUrl = `/api/conversations/${id}/download-letter`;
          aiResponse = aiResponse.replace('DOWNLOAD_LINK', downloadUrl);
        }
      } else if (responseIndex >= 0 && responseIndex < fixedConversation.length) {
        const currentStep = fixedConversation[responseIndex];
        if (currentStep && currentStep.aiResponse) {
          aiResponse = currentStep.aiResponse;
          
          console.log(`DEBUG: Using AI Response: "${aiResponse}"`);
          console.log(`DEBUG: Current Step:`, JSON.stringify(currentStep, null, 2));
          
          // Replace download link placeholder with actual URL
          if (aiResponse.includes('DOWNLOAD_LINK')) {
            const downloadUrl = `/api/conversations/${id}/download-letter`;
            aiResponse = aiResponse.replace('DOWNLOAD_LINK', downloadUrl);
          }
        }
      } else if (userMessageCount > fixedConversation.length) {
        // If conversation is complete, suggest returning to menu
        aiResponse = "Would you like to return to the main menu to explore Track 1 or Track 2 again?";
      }

      // Simulate AI thinking/typing delay with special handling for verification
      let typingDelay = Math.random() * 1000 + 1000; // Default: 1000-2000ms
      
      console.log(`DEBUG: About to check delays - actualLoanType: "${actualLoanType}", aiResponse: "${aiResponse.substring(0, 100)}..."`);
      
      // Increase delay for document verification messages (applies to ALL loan types)
      if (aiResponse.includes('verify') || aiResponse.includes('process') || 
          aiResponse.includes('⏳') || aiResponse.includes('reviewing') ||
          aiResponse.includes('Let me review') || aiResponse.includes('checking') ||
          aiResponse.includes('Let me verify') || aiResponse.includes('📄⏳') ||
          aiResponse.includes('Please wait while I process') || aiResponse.includes('Verifying') ||
          (aiResponse.includes('Thanks!') && aiResponse.includes('Let me')) ||
          aiResponse.includes('after 2 seconds') || 
          (aiResponse.includes('Perfect!') && aiResponse.includes('Let me review')) ||
          aiResponse.includes('Thanks! Let me verify your documents') ||
          aiResponse.includes('Verification complete') || aiResponse.includes('✅ Verification')) {
        
        // Special handling for car loans - 20 seconds delay for document verification
      
          // 40 second delay for other loan types
          typingDelay = 40000; // Fixed 40 seconds for other loan verification
          console.log(`Using extended verification delay: 40 seconds for document submission`);
     
      }
      
      await new Promise(resolve => setTimeout(resolve, typingDelay));

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

  app.get("/api/conversations/:id", async (req: any, res: any) => {
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

  // Download sanction letter endpoint
  app.get("/api/conversations/:id/download-letter", async (req: any, res: any) => {
    try {
      const { id } = req.params;
      const conversation = await storage.getConversation(id);
      
      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }

      // Get current user
      const currentUser = getCurrentUser(req);
      const applicantName = currentUser?.fullName || conversation.applicantName || "Valued Customer";
      
      // Generate a simple HTML document for the sanction letter
      const loanType = conversation.loanType || "loan";
      const loanTypeTitle = loanType.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      const date = new Date().toLocaleDateString('en-IN');
      
      // Get loan details based on type
      let loanDetails = {
        amount: "₹5,00,000",
        interest: "11.0%",
        tenure: "36 months",
        emi: "₹12,500"
      };
      
      if (loanType === "car-loan") {
        loanDetails = { amount: "₹7,00,000", interest: "10.5%", tenure: "48 months", emi: "₹17,456" };
      } else if (loanType === "education-loan") {
        loanDetails = { amount: "₹4,00,000", interest: "11.0%", tenure: "60 months", emi: "₹8,333" };
      } else if (loanType.includes("skill-course")) {
        loanDetails = { amount: "₹7,000", interest: "12.5%", tenure: "12 months", emi: "₹625" };
      } else if (loanType.includes("rent-deposit")) {
        loanDetails = { amount: "₹10,000", interest: "13.0%", tenure: "10 months", emi: "₹1,050" };
      } else if (loanType.includes("digital-credit")) {
        loanDetails = { amount: "₹6,000", interest: "12.0%", tenure: "9 months", emi: "₹700" };
      }

      const sanctionLetter = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Loan Sanction Letter</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; color: #333; }
        .header { text-align: center; border-bottom: 2px solid #0066cc; padding-bottom: 20px; margin-bottom: 30px; }
        .company-name { font-size: 24px; font-weight: bold; color: #0066cc; }
        .letter-title { font-size: 20px; margin-top: 10px; font-weight: bold; }
        .content { margin: 20px 0; }
        .loan-details { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; margin: 10px 0; }
        .label { font-weight: bold; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ccc; }
        .signature-section { margin-top: 30px; }
        @media print { body { margin: 0; } }
    </style>
</head>
<body>
    <div class="header">
        <div class="company-name">EYLIN FINANCIAL SERVICES</div>
        <div class="letter-title">LOAN SANCTION LETTER</div>
    </div>
    
    <div class="content">
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Ref No:</strong> EFS/${id.slice(-6).toUpperCase()}/${new Date().getFullYear()}</p>
        
        <p>Dear ${applicantName},</p>
        
        <p>We are pleased to inform you that your application for <strong>${loanTypeTitle}</strong> has been approved. We appreciate your interest in our financial services.</p>
        
        <div class="loan-details">
            <h3>Loan Details:</h3>
            <div class="detail-row">
                <span class="label">Loan Amount:</span>
                <span>${loanDetails.amount}</span>
            </div>
            <div class="detail-row">
                <span class="label">Interest Rate:</span>
                <span>${loanDetails.interest} per annum</span>
            </div>
            <div class="detail-row">
                <span class="label">Loan Tenure:</span>
                <span>${loanDetails.tenure}</span>
            </div>
            <div class="detail-row">
                <span class="label">Monthly EMI:</span>
                <span>${loanDetails.emi}</span>
            </div>
        </div>
        
        <p><strong>Terms and Conditions:</strong></p>
        <ul>
            <li>This sanction is valid for 30 days from the date of issue</li>
            <li>The loan amount will be disbursed upon completion of all documentation</li>
            <li>Repayment should begin from the next month after disbursement</li>
            <li>Processing fee and other charges apply as per our tariff</li>
        </ul>
        
        <p>Please contact our customer service team for the next steps in the loan disbursement process.</p>
        
        <div class="signature-section">
            <p>Yours sincerely,</p><br>
            <p><strong>Digital Loan Processing Team</strong><br>
            EYLIN FINANCIAL SERVICES<br>
            Email: loans@eylinfinancial.com<br>
            Phone: 1800-XXX-XXXX</p>
        </div>
    </div>
    
    <div class="footer">
        <p style="font-size: 12px; color: #666;">
            This is a digitally generated document. No physical signature is required.
            <br>Generated on ${new Date().toLocaleString('en-IN')}
        </p>
    </div>
    
    <script>
        // Enhanced PDF download functionality
        function downloadPDF() {
            // Hide the download button before printing
            const button = document.querySelector('.download-btn');
            if (button) button.style.display = 'none';
            
            // Set print title
            document.title = 'Loan Sanction Letter - ${applicantName}';
            
            // Print the document
            window.print();
            
            // Show button again after print dialog
            setTimeout(() => {
                if (button) button.style.display = 'block';
            }, 1000);
        }
        
        // Add download button and auto-focus functionality
        window.onload = function() {
            const button = document.createElement('button');
            button.innerHTML = '📄 Download/Print PDF';
            button.className = 'download-btn';
            button.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #0066cc; color: white; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; z-index: 1000; font-weight: bold; box-shadow: 0 4px 12px rgba(0,102,204,0.3); transition: all 0.3s ease;';
            button.onmouseover = () => button.style.transform = 'translateY(-2px)';
            button.onmouseout = () => button.style.transform = 'translateY(0px)';
            button.onclick = downloadPDF;
            document.body.appendChild(button);
            
            // Auto-focus for better UX
            button.focus();
        };
        
        // Add print-specific styles
        const printStyles = \`
            @media print {
                .download-btn { display: none !important; }
                body { margin: 0; padding: 20px; }
                .header { border-bottom: 3px solid #0066cc; }
                .loan-details { background: #f5f5f5 !important; }
            }
        \`;
        const styleSheet = document.createElement("style");
        styleSheet.innerText = printStyles;
        document.head.appendChild(styleSheet);
    </script>
</body>
</html>`;

      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Content-Disposition', `inline; filename="Sanction-Letter-${id.slice(-6).toUpperCase()}.html"`);
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.send(sanctionLetter);
      
    } catch (error) {
      console.error("Error generating sanction letter:", error);
      return res.status(500).json({ error: "Failed to generate sanction letter" });
    }
  });

  // Save conversation as loan application endpoint
  app.post("/api/conversations/:id/save-application", async (req: any, res: any) => {
    try {
      const { id } = req.params;
      const conversation = await storage.getConversation(id);
      
      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }

      // Get current user (for demo, use default user if not authenticated)
      const currentUser = getCurrentUser(req);
      let applicantId = 'user-123'; // default demo user
      let applicantName = 'Demo User';
      
      if (currentUser) {
        applicantId = currentUser.id;
        applicantName = currentUser.fullName;
      }

      // Create loan application from conversation
      const loanApplication = {
        id: `APP-${Date.now()}-${id.slice(-6).toUpperCase()}`,
        conversationId: id,
        applicantId: applicantId,
        applicantName: applicantName,
        loanType: conversation.loanType,
        status: "Draft",
        messages: Array.isArray(conversation.messages) ? conversation.messages : [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        applicationData: {
          // Extract key information from conversation
          loanAmount: extractLoanAmount(Array.isArray(conversation.messages) ? conversation.messages : []),
          purpose: getLoanPurpose(conversation.loanType),
          documents: getSubmittedDocuments(Array.isArray(conversation.messages) ? conversation.messages : []),
        }
      };

      // Save the application (using storage)
      await storage.saveLoanApplication(loanApplication);
      console.log("Saved loan application:", loanApplication);

      return res.json({ 
        message: "Conversation saved as loan application successfully",
        applicationId: loanApplication.id,
        application: loanApplication
      });
      
    } catch (error) {
      console.error("Error saving loan application:", error);
      return res.status(500).json({ error: "Failed to save loan application" });
    }
  });

  // Get saved loan applications for current user
  app.get("/api/applications", async (req: any, res: any) => {
    try {
      // For demo purposes, use a default applicantId if not authenticated
      let applicantId = 'user-123'; // default demo user
      
      const currentUser = getCurrentUser(req);
      if (currentUser) {
        applicantId = currentUser.id;
      }
      
      // Allow query parameter to override applicantId for demo
      if (req.query.applicantId) {
        applicantId = req.query.applicantId;
      }

      const applications = await storage.getLoanApplications(applicantId);
      return res.json(applications);
      
    } catch (error) {
      console.error("Error fetching loan applications:", error);
      return res.status(500).json({ error: "Failed to fetch loan applications" });
    }
  });

  // Get specific loan application details
  app.get("/api/applications/:id", async (req: any, res: any) => {
    try {
      const { id } = req.params;
      const currentUser = getCurrentUser(req);
      
      if (!currentUser) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const application = await storage.getLoanApplication(id);
      
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }

      // Ensure user can only access their own applications
      if (application.applicantId !== currentUser.id) {
        return res.status(403).json({ error: "Access denied" });
      }

      return res.json({ application });
      
    } catch (error) {
      console.error("Error fetching loan application:", error);
      return res.status(500).json({ error: "Failed to fetch loan application" });
    }
  });

  // Helper functions for loan application data extraction
  function extractLoanAmount(messages: any[]): string {
    // Look for amount patterns in messages
    for (const message of messages) {
      if (message.isUser && message.text) {
        const amountMatch = message.text.match(/₹\s*[\d,]+(?:\s*lakh)?/i) || 
                           message.text.match(/(\d+)\s*lakh/i) ||
                           message.text.match(/₹\s*(\d+(?:,\d+)*)/);
        if (amountMatch) {
          return amountMatch[0];
        }
      }
    }
    return "Not specified";
  }

  function getLoanPurpose(loanType: string): string {
    const purposes: Record<string, string> = {
      "car-loan": "Vehicle Purchase",
      "education-loan": "Education/Course Fees",
      "business-loan": "Business Expansion",
      "skill-course-loan": "Skill Development",
      "rent-deposit-loan": "Rent/Security Deposit",
      "digital-credit-loan": "Credit Building",
      "small-business-loan": "Small Business Investment"
    };
    return purposes[loanType] || "Other";
  }

  function getSubmittedDocuments(messages: any[]): string[] {
    const documents = [];
    for (const message of messages) {
      if (message.text && (message.text.includes("upload") || message.text.includes("document"))) {
        if (message.text.includes("PAN")) documents.push("PAN Card");
        if (message.text.includes("Aadhaar")) documents.push("Aadhaar Card");
        if (message.text.includes("salary") || message.text.includes("ITR")) documents.push("Income Proof");
        if (message.text.includes("admission")) documents.push("Admission Letter");
        if (message.text.includes("GST")) documents.push("GST Return");
      }
    }
    return documents.length > 0 ? documents : ["Standard KYC Documents"];
  }

  // ===== BLOCKCHAIN & AI INTEGRATION ENDPOINTS =====
  // (These endpoints are prepared for when OSO, LangChain, and Ethereum packages are installed)

  // OSO Authorization endpoint
  app.post("/api/auth/check-permission", async (req: any, res: any) => {
    try {
      // Placeholder for OSO authorization check
      // const { action, resource } = req.body;
      // const user = getCurrentUser(req);
      // const allowed = await checkPermission(user, action, resource);
      
      // Mock response for demo
      const mockPermission = { allowed: true, reason: "Demo mode - all permissions granted" };
      res.json(mockPermission);
    } catch (error) {
      res.status(500).json({ error: "Authorization check failed" });
    }
  });

  // AI Agent loan analysis endpoint
  app.post("/api/ai/analyze-loan", async (req: any, res: any) => {
    try {
      // Placeholder for AI agent analysis
      // await loanAgent.initialize();
      // const analysis = await loanAgent.processLoanApplication(req.body);
      
      // Mock AI analysis for demo
      const mockAnalysis = {
        creditScore: 720,
        riskLevel: "medium",
        recommendation: "Approved with standard terms",
        eligibleAmount: 500000,
        interestRate: 12.5,
        tenure: 60,
        confidence: 0.89
      };
      
      res.json(mockAnalysis);
    } catch (error) {
      res.status(500).json({ error: "AI analysis failed" });
    }
  });

  // Blockchain loan record endpoint
  app.post("/api/blockchain/create-loan-record", async (req: any, res: any) => {
    try {
      // Placeholder for blockchain integration
      // const { loanId, borrowerAddress, amount, interestRate, tenure } = req.body;
      // const txHash = await ethereumService.createLoanRecord({
      //   loanId, borrowerAddress, amount, interestRate, tenure
      // });
      
      // Mock blockchain response for demo
      const mockTxHash = `0x${Date.now().toString(16)}abcdef`;
      const mockResponse = {
        success: true,
        transactionHash: mockTxHash,
        blockchainNetwork: "Ethereum Sepolia Testnet",
        gasUsed: "21000",
        status: "confirmed"
      };
      
      res.json(mockResponse);
    } catch (error) {
      res.status(500).json({ error: "Blockchain transaction failed" });
    }
  });

  // Get loan record from blockchain
  app.get("/api/blockchain/loan/:loanId", async (req: any, res: any) => {
    try {
      // Placeholder for blockchain query
      // const loanData = await ethereumService.getLoanRecord(req.params.loanId);
      
      // Mock blockchain query response
      const mockLoanData = {
        loanId: req.params.loanId,
        borrower: "0x1234567890123456789012345678901234567890",
        amount: "700000",
        interestRate: "12.5",
        tenure: "60",
        status: "active",
        createdAt: Date.now(),
        blockNumber: 18500000,
        transactionHash: "0xabcdef123456789"
      };
      
      res.json(mockLoanData);
    } catch (error) {
      res.status(500).json({ error: "Blockchain query failed" });
    }
  });

  // Web3 wallet generation endpoint
  app.post("/api/web3/generate-wallet", async (req: any, res: any) => {
    try {
      // Placeholder for wallet generation
      // const wallet = EthereumLoanService.generateWallet();
      
      // Mock wallet generation for demo
      const mockWallet = {
        address: "0x" + Math.random().toString(16).substr(2, 40),
        publicKey: "0x" + Math.random().toString(16).substr(2, 128),
        mnemonic: "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about",
        note: "This is a mock wallet for demo purposes"
      };
      
      res.json(mockWallet);
    } catch (error) {
      res.status(500).json({ error: "Wallet generation failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
