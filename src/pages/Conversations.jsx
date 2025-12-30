import { useEffect, useState } from "react";
import { adminFetch } from "../api/adminApi";
import Layout from "../components/Layout";

export default function Conversations() {
  const [list, setList] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const data = await adminFetch("/admin/conversations");
    setList(data);
  }

  async function open(convo) {
    setSelected(convo);
    const msgs = await adminFetch(
      `/admin/conversations/${convo.id}/messages`
    );
    setMessages(msgs);
  }

  return (
    <Layout title="Conversations">
      <div style={styles.wrap}>
        <div style={styles.list}>
          {list.map(c => (
            <div
              key={c.id}
              style={styles.item}
              onClick={() => open(c)}
            >
              <strong>{c.domain}</strong>
              <div style={styles.sub}>{c.session_id}</div>
            </div>
          ))}
        </div>

        <div style={styles.detail}>
          {selected ? (
            messages.map((m, i) => (
              <div key={i} style={styles.msg}>
                <strong>{m.role}</strong>: {m.text}
              </div>
            ))
          ) : (
            <div>Select a conversation</div>
          )}
        </div>
      </div>
    </Layout>
  );
}

const styles = {
  wrap: { display: "flex", gap: 20 },
  list: { width: 300 },
  item: {
    padding: 10,
    borderBottom: "1px solid #334155",
    cursor: "pointer"
  },
  sub: { fontSize: 12, color: "#94a3b8" },
  detail: {
    flex: 1,
    background: "#0f172a",
    padding: 16,
    borderRadius: 8
  },
  msg: { marginBottom: 10 }
};
