// /app/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Player, Controls } from '@lottiefiles/react-lottie-player';

export default function Home() {
    const [roomName, setRoomName] = useState("");
    const router = useRouter();

    const handleCreateRoom = () => {
        if (roomName.trim()) {
            router.push(`/game?room=${roomName}`);
        }
    };
    return (
        <div className="flex flex-col items-center min-h-screen bg-slate-900">
            <div>
                <Player
                    autoplay
                    loop
                    src="/assets/lotties/intro.json"
                    style={{ height: '200px', width: '300px' }}
                >
                    <Controls visible={false} buttons={['play', 'repeat', 'frame', 'debug']} />
                </Player>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-lg">

                <h1 className="text-2xl font-bold mb-4 text-center">Crazy Race Game</h1>
                <input
                    type="text"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    placeholder="Digite um nome para criar a sala"
                    className="w-full p-2 mb-8 border border-gray-300 rounded text-center"
                />
                <button
                    onClick={handleCreateRoom}
                    className="w-full p-2 bg-[#FF740A] text-white rounded drop-shadow-md hover:bg-[#FF740A] animate-bounce"
                >
                    Criar sala
                </button>
            </div>
        </div>
    );
}
