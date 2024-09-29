"use client";

import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { Player, Controls } from '@lottiefiles/react-lottie-player';
import { LucideAArrowDown, LucideAArrowUp, LucideArrowBigDown, LucideArrowBigLeft, LucideArrowBigRight, LucideArrowBigUp } from "lucide-react";




const socket = io("http://localhost:8000");

export default function ControlPage() {
    const [playerName, setPlayerName] = useState("");
    const [roomName, setRoomName] = useState("");
    const [joined, setJoined] = useState(false);
    const [winner, setWinner] = useState(null);

    useEffect(() => {
        socket.on("connect", () => {
            console.log("Connected to server");
        });

        socket.on("announceWinner", (winner) => {
            setWinner(winner);
        });

        return () => {
            socket.off("connect");
            socket.off("announceWinner");
        };
    }, []);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (!joined) return;

            switch (event.key) {
                case "ArrowUp":
                    handleControl("up");
                    break;
                case "ArrowDown":
                    handleControl("down");
                    break;
                case "ArrowLeft":
                    handleControl("left");
                    break;
                case "ArrowRight":
                    handleControl("right");
                    break;
                default:
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [joined]);

    const handleJoinRoom = () => {
        if (playerName && roomName) {
            socket.emit("joinRoom", { room: roomName, playerName });
            setJoined(true); // Atualiza o estado para indicar que o jogador entrou na sala
        }
    };

    const handleControl = (direction) => {
        socket.emit("control", { room: roomName, direction });
    };

    const handleRestartGame = () => {
        socket.emit("restartGame", roomName);
        setWinner(null);
        setJoined(false);
    };

    if (winner) {
        return (
            <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-900">
                <h1 className="text-3xl font-bold mb-4 text-white">Fim de jogo!</h1>
                <h1 className="text-3xl font-bold mb-4 text-[#FF740A] text-center">{winner} <span className="text-white">ganhou a partida</span></h1>
                <button
                    onClick={handleRestartGame}
                    className="p-2 w-60 bg-[#FF740A] font-bold drop-shadow-md text-white rounded"
                >
                    Deseja jogar novamente?
                </button>
            </main >
        );
    }

    if (!joined) {
        return (
            <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-900">
                <div>
                    <Player
                        autoplay
                        loop
                        src="/assets/lotties/intro-control.json"
                        style={{ height: '200px', width: '300px' }}
                    >
                        <Controls visible={false} buttons={['play', 'repeat', 'frame', 'debug']} />
                    </Player>
                </div>
                <div className="p-6 bg-white rounded-lg shadow-lg">
                    <h1 className="text-xl font-bold mb-4 text-center">Bem-vindo à Crazy Race Game</h1>
                    <input
                        type="text"
                        placeholder="Nome do jogador"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        className="w-full p-2 border rounded mb-4 text-center"
                    />
                    <input
                        type="text"
                        placeholder="Código da sala"
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                        className="w-full p-2 mb-8 border border-gray-300 rounded text-center"
                    />
                    <button
                        onClick={handleJoinRoom}
                        className="w-full p-2 bg-[#FF740A] text-white rounded "
                    >
                        Entrar na sala
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="flex flex-col items-center h-screen bg-slate-900  ">
            <div className="flex items-center justify-between w-full gap-6 mt-10 px-4">
                <h1 className="text-xl font-bold text-center text-white">
                    <p className="text-[#FF740A]">
                        Sala:
                    </p>
                    {roomName}</h1>
                <h1 className="text-xl font-bold text-center text-white ">
                    <p className="text-[#FF740A]">
                        Jogador:
                    </p>
                    {playerName}</h1>

            </div>
            <div className="flex justify-center mt-80 ">
                <div className="flex gap-4   ">
                    <div className="flex items-center">
                        <button
                            onClick={() => handleControl("left")}
                            className="p-4 w-24 bg-[#FF740A] text-white rounded"
                        >
                            <LucideArrowBigLeft />
                        </button>

                    </div>
                    <div className="flex justify-center item flex-col gap-10">
                        <button
                            onClick={() => handleControl("up")}
                            className="p-4 w-24 bg-[#FF740A] text-white rounded flex items-center"
                        >
                            <LucideArrowBigUp />


                        </button>

                        <button
                            onClick={() => handleControl("down")}
                            className="p-4 w-24 bg-[#FF740A] text-white rounded"
                        >
                            <LucideArrowBigDown />
                        </button>

                    </div>
                    <div className="flex items-center">
                        <button
                            onClick={() => handleControl("right")}
                            className="p-4 w-24 bg-[#FF740A] text-white rounded"
                        >
                            <LucideArrowBigRight />
                        </button>
                    </div>
                </div>
            </div>
        </main >
    );
}
