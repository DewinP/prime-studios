"use client";

export function Post() {
  return (
    <div className="w-full max-w-xs">
      <p className="truncate">Your most recent post: </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="flex flex-col gap-2"
      >
        <input
          type="text"
          placeholder="Title"
          className="w-full rounded-full bg-white/10 px-4 py-2 text-white"
        />
        <button
          type="submit"
          className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
        >
          submit
        </button>
      </form>
    </div>
  );
}
