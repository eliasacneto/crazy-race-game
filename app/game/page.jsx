"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { io } from "socket.io-client";
import Game from "../../components/Game";
import Swal from "sweetalert2";

const socket = io("http://localhost:8000");

export default function GamePage() {
    const [players, setPlayers] = useState({});
    const searchParams = useSearchParams();
    const room = searchParams.get("room");

    useEffect(() => {
        if (room) {
            socket.emit("createRoom", room);
        }

        socket.on("updatePlayers", (players) => {
            setPlayers(players);
        });

        socket.on("announceWinner", (winner) => {
            Swal.fire({
                title: "🥇",
                text: `O ganhador do jogo foi: ${winner}!`,
            });
        });

        return () => {
            socket.off("updatePlayers");
            socket.off("announceWinner");
        };
    }, [room]);

    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4">
            <h1 className="text-3xl font-bold mb-8 text-center"><p className="text-[#FF740A]">Sala:</p>{room}</h1>
            <Game players={players} />
            <div className="mt-8 text-lg">
                <h2 className="text-2xl font-semibold mb-4 text-[#FF740A]">Jogadores na sala:</h2>
                <ul>
                    {Object.values(players).map((player) => (
                        <li key={player.name} className="mb-2">
                            {player.name}
                        </li>
                    ))}
                </ul>
            </div>
        </main>
    );
}
