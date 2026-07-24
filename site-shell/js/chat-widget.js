(function () {
  const WORKER_URL = 'https://lectures.nayajansiz2005.workers.dev'

  function getLectureText() {
    const blocks = document.querySelectorAll('.section-block')
    if (blocks.length) {
      return Array.from(blocks)
        .map(el => el.innerText)
        .join('\n\n')
        .slice(0, 8000)
    }
    return (document.querySelector('main') || document.body).innerText.slice(0, 8000)
  }

  const style = document.createElement('style')
  style.textContent = `
    #ai-chat-btn {
      position: fixed; bottom: 24px; right: 24px; z-index: 9999;
      background: #4f46e5; color: #fff; border: none; border-radius: 50px;
      padding: 12px 20px; font-size: 15px; cursor: pointer; box-shadow: 0 4px 14px rgba(0,0,0,0.2);
    }
    #ai-chat-box {
      display: none; position: fixed; bottom: 80px; right: 24px; z-index: 9999;
      width: 340px; max-height: 500px; background: #fff; border-radius: 16px;
      box-shadow: 0 8px 30px rgba(0,0,0,0.15); overflow: hidden; flex-direction: column;
      font-family: sans-serif;
    }
    #ai-chat-box.open { display: flex; }
    #ai-chat-header {
      background: #4f46e5; color: #fff; padding: 14px 16px; font-weight: 600; font-size: 14px;
    }
    #ai-chat-messages {
      flex: 1; overflow-y: auto; padding: 12px; display: flex; flex-direction: column; gap: 8px;
    }
    .ai-msg, .user-msg {
      max-width: 85%; padding: 8px 12px; border-radius: 12px; font-size: 13px; line-height: 1.5;
    }
    .user-msg { background: #4f46e5; color: #fff; align-self: flex-end; border-bottom-right-radius: 4px; }
    .ai-msg { background: #f1f5f9; color: #1e293b; align-self: flex-start; border-bottom-left-radius: 4px; }
    .ai-msg.thinking { color: #94a3b8; font-style: italic; }
    #ai-chat-input-row {
      display: flex; border-top: 1px solid #e2e8f0; padding: 10px;
    }
    #ai-chat-input {
      flex: 1; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px 10px;
      font-size: 13px; outline: none; resize: none;
    }
    #ai-chat-send {
      margin-left: 8px; background: #4f46e5; color: #fff; border: none;
      border-radius: 8px; padding: 8px 14px; cursor: pointer; font-size: 13px;
    }
  `
  document.head.appendChild(style)

  document.body.insertAdjacentHTML('beforeend', `
    <button id="ai-chat-btn">Ask AI</button>
    <div id="ai-chat-box">
      <div id="ai-chat-header">Ask about this lecture</div>
      <div id="ai-chat-messages"></div>
      <div id="ai-chat-input-row">
        <textarea id="ai-chat-input" rows="2" placeholder="Ask a question..."></textarea>
        <button id="ai-chat-send">Send</button>
      </div>
    </div>
  `)

  const btn = document.getElementById('ai-chat-btn')
  const box = document.getElementById('ai-chat-box')
  const messages = document.getElementById('ai-chat-messages')
  const input = document.getElementById('ai-chat-input')
  const send = document.getElementById('ai-chat-send')

  btn.addEventListener('click', () => box.classList.toggle('open'))

  function addMsg(text, type) {
    const div = document.createElement('div')
    div.className = type === 'user' ? 'user-msg' : 'ai-msg'
    div.textContent = text
    messages.appendChild(div)
    messages.scrollTop = messages.scrollHeight
    return div
  }

  async function askQuestion() {
    const question = input.value.trim()
    if (!question) return
    input.value = ''
    addMsg(question, 'user')
    const thinking = addMsg('Thinking...', 'ai')
    thinking.classList.add('thinking')
    try {
      const res = await fetch(WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, lectureText: getLectureText() })
      })
      const data = await res.json()
      thinking.classList.remove('thinking')
      thinking.textContent = data.answer
    } catch {
      thinking.textContent = 'Something went wrong. Please try again.'
    }
  }

  send.addEventListener('click', askQuestion)
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); askQuestion() }
  })
})()
