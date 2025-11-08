import MessageBubble from "../MessageBubble";

export default function MessageBubbleExample() {
  return (
    <div className="space-y-4 max-w-3xl mx-auto p-6">
      <MessageBubble
        message="Hi there! That's exciting — a new ride coming up! Could you share approximately how much you're looking to borrow for your car?"
        isUser={false}
      />
      <MessageBubble
        message="Around 7 lakh rupees."
        isUser={true}
      />
    </div>
  );
}
