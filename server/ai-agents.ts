// AI Agents Configuration for Enhanced Loan Processing
import { Agent, AgentExecutor } from "langchain/agents";
import { OpenAI } from "langchain/llms/openai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { Tool } from "langchain/tools";

// Custom tools for loan processing
export class LoanAnalysisTool extends Tool {
  name = "loan_analysis";
  description = "Analyzes loan application data and provides recommendations";

  async _call(input: string): Promise<string> {
    try {
      const data = JSON.parse(input);
      
      // Mock loan analysis logic
      const analysis = {
        creditScore: this.calculateCreditScore(data),
        riskLevel: this.assessRiskLevel(data),
        recommendation: this.generateRecommendation(data),
        eligibleAmount: this.calculateEligibleAmount(data)
      };
      
      return JSON.stringify(analysis);
    } catch (error) {
      return `Error analyzing loan data: ${error}`;
    }
  }

  private calculateCreditScore(data: any): number {
    // Mock credit score calculation
    const baseScore = 650;
    let score = baseScore;
    
    if (data.income > 50000) score += 50;
    if (data.income > 100000) score += 100;
    if (data.age > 30) score += 25;
    if (data.occupation === "government") score += 75;
    
    return Math.min(850, score);
  }

  private assessRiskLevel(data: any): string {
    const score = this.calculateCreditScore(data);
    if (score >= 750) return "low";
    if (score >= 650) return "medium";
    return "high";
  }

  private generateRecommendation(data: any): string {
    const risk = this.assessRiskLevel(data);
    switch (risk) {
      case "low": return "Approved with standard terms";
      case "medium": return "Approved with moderate interest rate";
      case "high": return "Requires manual review";
      default: return "Additional documentation required";
    }
  }

  private calculateEligibleAmount(data: any): number {
    const monthlyIncome = data.income || 0;
    const maxEMI = monthlyIncome * 0.4; // 40% of income
    const interestRate = 0.12; // 12% annual
    const tenure = 5; // 5 years
    
    // EMI calculation: P = EMI * [1 - (1 + r)^(-n)] / r
    const monthlyRate = interestRate / 12;
    const months = tenure * 12;
    
    const eligibleAmount = maxEMI * (1 - Math.pow(1 + monthlyRate, -months)) / monthlyRate;
    return Math.round(eligibleAmount);
  }
}

export class DocumentVerificationTool extends Tool {
  name = "document_verification";
  description = "Verifies uploaded documents for loan applications";

  async _call(input: string): Promise<string> {
    try {
      const { documentType, documentData } = JSON.parse(input);
      
      // Mock document verification logic
      const verificationResult = {
        isValid: true,
        confidence: 0.95,
        extractedData: this.extractDocumentData(documentType, documentData),
        issues: []
      };
      
      return JSON.stringify(verificationResult);
    } catch (error) {
      return `Error verifying document: ${error}`;
    }
  }

  private extractDocumentData(type: string, data: any) {
    switch (type) {
      case "pan_card":
        return {
          panNumber: "ABCDE1234F",
          name: "John Doe",
          dateOfBirth: "1990-01-01"
        };
      case "salary_slip":
        return {
          grossSalary: 85000,
          deductions: 15000,
          netSalary: 70000,
          company: "Tech Corp Ltd"
        };
      case "bank_statement":
        return {
          averageBalance: 250000,
          monthlyCredits: 85000,
          accountNumber: "****1234"
        };
      default:
        return {};
    }
  }
}

// AI Agent configuration
export class LoanProcessingAgent {
  private agent: AgentExecutor | null = null;

  async initialize() {
    try {
      // Initialize LLM (using mock for demo - no actual OpenAI call)
      const llm = new ChatOpenAI({
        temperature: 0.1,
        modelName: "gpt-4",
        openAIApiKey: "mock-key" // Mock key for demo
      });

      // Initialize tools
      const tools = [
        new LoanAnalysisTool(),
        new DocumentVerificationTool()
      ];

      // Create agent
      this.agent = await AgentExecutor.fromAgentAndTools({
        agent: await Agent.fromLLMAndTools(llm, tools),
        tools,
        verbose: true
      });

      console.log("AI Loan Processing Agent initialized successfully");
    } catch (error) {
      console.error("Failed to initialize AI agent:", error);
    }
  }

  async processLoanApplication(applicationData: any): Promise<any> {
    if (!this.agent) {
      throw new Error("Agent not initialized");
    }

    try {
      const prompt = `
        Analyze the following loan application and provide recommendations:
        ${JSON.stringify(applicationData, null, 2)}
        
        Please use the available tools to:
        1. Analyze the loan eligibility
        2. Verify any uploaded documents
        3. Provide a comprehensive recommendation
      `;

      const result = await this.agent.call({
        input: prompt
      });

      return result;
    } catch (error) {
      console.error("Error processing loan application:", error);
      return {
        error: "Failed to process loan application",
        details: error
      };
    }
  }

  async verifyDocuments(documents: any[]): Promise<any> {
    const verificationPromises = documents.map(async (doc) => {
      const tool = new DocumentVerificationTool();
      return await tool._call(JSON.stringify(doc));
    });

    try {
      const results = await Promise.all(verificationPromises);
      return results.map(result => JSON.parse(result));
    } catch (error) {
      console.error("Document verification failed:", error);
      return [];
    }
  }
}

// Export singleton instance
export const loanAgent = new LoanProcessingAgent();