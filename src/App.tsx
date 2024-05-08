import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  createColumnHelper,
  getPaginationRowModel,
  getSortedRowModel,
} from '@tanstack/react-table';

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
  // ページのデータ取得件数
  const [pageSize, setPageSize] = useState<number>(30);

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
  }, []);

  // カラムヘルパー
  const columnHelper = createColumnHelper<Post>();

  // カラム定義
  const columns = [
    // accessorFn 関数を利用すること複数列をまとめれる
    columnHelper.accessor((row) => `${row.userId} ${row.id}`, {
      id: 'WID',
    }),
    columnHelper.accessor('id', {
      header: () => <span>ID</span>,
    }),
    columnHelper.accessor('title', {
      header: 'Title',
      // テーブルセルのカスタマイズ
      // columnHelperを使うと propsの型がanyではなく解決される
      cell: (props) => props.getValue().toUpperCase(),
      // ソートの初期値
      sortDescFirst: false,
    }),
    { 
      accessorKey: 'body', 
      header: 'Body',
    },
    // display列を設定することでテーブルのデータに含まれない更新や削除列を足せる
    columnHelper.display({
      id: 'update',
      header: '更新',
      cell: (props) => (
        <button onClick={() => update(props.row.original.id)}>
          更新
        </button>
      )
    }),
    columnHelper.display({
      id: 'delete',
      header: '削除',
      cell: (props) => (
        <button onClick={() => delete(props.row.original.id)}>
          削除
        </button>
      )
    }),
  ];

  // テーブル定義
  const tablePosts = useReactTable({
    data: posts,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // 初期表示件数
    initialState: {
      pagination: {
        pageSize: 30,
      }
    },
    // ソート
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <>
      {/* Postの内容をテーブルに表示 */}
      <div style={{ margin: '2em' }}>
        <h1>Post List</h1>
        {/* 件数 */}
        <p>Page Count: {tablePosts.getPageCount()}</p>
        {/* ソート状況 */}
        <div>
          Sorting: {<pre>{JSON.stringify(tablePosts.getState().sorting, null, 2)}</pre>}
        </div>
        {/* データ取得件数選択 */}
        <div>Page Size</div>
        <select
          value={pageSize}
          onChange={(e) => {
            let size = parseInt(e.target.value);
            tablePosts.setPageSize(size);
            setPageSize(size);
          }}
          >
          <option value={10}>10</option>
          <option value={30}>30</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        {/* ページネーション */}
        <div style={{ display: 'flex', marginBottom: '1em' }}>
          {/* 戻るボタン */}
          <button
            disabled={!tablePosts.getCanPreviousPage()}
            onClick={() => tablePosts.previousPage()}>
              Privious
          </button>

          {Array.from({ length: tablePosts.getPageCount() }, (_, i) => i).map(
            (index) => (
              <div
                key={index}
                style={{
                  backgroundColor:
                    tablePosts.getState().pagination.pageIndex === index ? 'blue' : '',
                  color:
                    tablePosts.getState().pagination.pageIndex === index ? 'white': 'black',
                  paddiing: '0 0.5em 0 0.5em',
                  margin: '0 0.2em 0 0.2em',
                  cursor: 'pointer',
                  }}
                onClick={() => tablePosts.setPageIndex(index)}
              >
                {index + 1}
          </div>
          )
          )}
          {/* 進ボタン */}
          <button
            disabled={!tablePosts.getCanNextPage()}
            onClick={() => tablePosts.nextPage()}>
              Next
          </button>          
        </div>

        <table>
          <thead>
            {tablePosts.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {{
                      asc: ' 🔼',
                      desc: ' 🔽',
                    }[header.column.getIsSorted() as string] ?? null}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {tablePosts.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
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
