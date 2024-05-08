import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

// 投稿データの型
type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
}

function App() {
  const [count, setCount] = useState(0)
  // テーブルデータ保持用
  const [posts, setPosts] = useState<Post[]>([]);

  // データ取得してステートで管理
  useEffect(() => {
    const getPosts = async () => {
      const response = await fetch(
        'https://jsonplaceholder.typicode.com/posts'
      );

      const data = await response.json();
      setPosts(data);
    };

    // データ取得
    getPosts();
  });

  return (
    <>
      {/* Postの内容をテーブルに表示 */}
      <div style={{ margin: '2em' }}>
        <h1>Hello</h1>
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              {post.title}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
