import Image from 'next/image'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <input type="text"></input>
        <input type="text"></input>
        <label><input type="checkbox"></input></label>
        <button>Go</button>
      </div>
    </main>
  )
}
