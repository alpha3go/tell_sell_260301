import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 sm:p-20 font-sans">
      <main className="flex flex-col gap-10 items-center text-center w-full max-w-4xl">

        {/* Header Section */}
        <div className="neo-card bg-neo-yellow p-8 sm:p-14 border-4 rotate-1 w-full max-w-2xl">
          <h1 className="text-6xl sm:text-7xl font-black uppercase tracking-tighter mb-4 break-keep">
            텔 앤 셀
          </h1>
          <p className="text-2xl sm:text-3xl font-bold bg-white neo-border px-6 py-3 inline-block -rotate-2 break-keep">
            AI 영업 말하기 훈련장
          </p>
        </div>

        {/* Description */}
        <div className="neo-card p-8 sm:p-10 max-w-2xl text-left bg-neo-blue text-white w-full shadow-[8px_8px_0_#000]">
          <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
            <span className="bg-neo-pink text-black px-3 py-1 neo-border text-lg">-&gt;</span>
            영업의 달인이 되어보세요
          </h2>
          <p className="text-xl font-medium leading-relaxed break-keep mt-4">
            어려운 고객을 상대로 <strong>가상 연습</strong>을 하고, AI에게 <strong>맞춤형 피드백</strong>을 받아 영업 실력을 키워보세요.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 w-full max-w-2xl justify-center mt-6">
          <a href="/training" className="neo-btn bg-neo-pink text-black px-10 py-6 text-2xl w-full sm:w-auto -rotate-1 text-center border-4">
            🚀 훈련 시작하기
          </a>
          <button className="neo-btn bg-white text-black px-10 py-6 text-2xl w-full sm:w-auto rotate-1 text-center border-4">
            📊 내 기록 보기
          </button>
        </div>

      </main>
    </div>
  );
}
