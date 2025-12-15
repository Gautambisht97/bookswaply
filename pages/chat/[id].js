import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { auth, db } from "../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";

export default function ChatPage() {
  const router = useRouter();
  const { id } = router.query;

  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubAuth();
  }, []);

  useEffect(() => {
    if (!id) return;

    const q = collection(db, "chats", id, "messages");
    const unsub = onSnapshot(q, (snap) => {
      setMessages(
        snap.docs.map(d => ({ id: d.id, ...d.data() }))
      );
    });

    return () => unsub();
  }, [id]);

  const sendMessage = async () => {
    if (!text.trim()) return;

    await addDoc(collection(db, "chats", id, "messages"), {
      from: user.uid,
      text,
      createdAt: new Date(),
    });

    setText("");
  };

  if (!user) return <p className="mt-10 text-center">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Chat</h1>

      <div className="border rounded-lg p-4 h-80 overflow-y-auto bg-white dark:bg-neutral-800">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`mb-2 ${
              msg.from === user.uid ? "text-right" : "text-left"
            }`}
          >
            <span className="inline-block px-3 py-2 rounded-lg bg-gray-200 dark:bg-neutral-700">
              {msg.text}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border rounded px-3 py-2"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="btn-primary"
        >
          Send
        </button>
      </div>
    </div>
  );
}
