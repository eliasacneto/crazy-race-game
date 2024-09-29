import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:8000");

export default function Game({ players }) {
    const canvasRef = useRef(null);
    const [winner, setWinner] = useState(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext("2d");
        if (!context) return;

        context.clearRect(0, 0, canvas.width, canvas.height);

        //     Object.values(players).forEach((player, index) => {
        //         const colors = ["red", "blue", "green", "yellow"];
        //         const color = colors[index % colors.length];

        //         // Draw car
        //         context.fillStyle = color;
        //         context.fillRect(player.x, player.y, 50, 50);

        //         // Draw player name
        //         context.font = "18px Arial";
        //         context.fillStyle = "white";
        //         context.textAlign = "center";
        //         context.fillText(player.name, player.x + 25, player.y - 10);
        //     });
        // }, [players]);
        Object.values(players).forEach((player, index) => {
            const colors = ["red", "blue", "green", "yellow"];
            const color = colors[index % colors.length];

            // Draw car body (Formula 1 style)
            context.fillStyle = color;

            // Central body
            context.fillRect(player.x + 15, player.y, 20, 60); // Corpo central
            context.fillRect(player.x + 5, player.y, 40, 5); // Asa dianteira
            context.fillRect(player.x + 5, player.y + 55, 40, 5); // Asa traseira
            // Cockpit
            context.fillStyle = "gray";
            context.fillRect(player.x + 20, player.y + 20, 10, 20); // Cockpit

            // Wheels
            context.fillStyle = "black";
            context.beginPath();
            context.arc(player.x + 5, player.y + 10, 8, 0, Math.PI * 2, true);
            context.fill();
            // Front right wheel
            context.beginPath();
            context.arc(player.x + 45, player.y + 10, 8, 0, Math.PI * 2, true);
            context.fill();
            // Rear left wheel
            context.beginPath();
            context.arc(player.x + 5, player.y + 50, 8, 0, Math.PI * 2, true);
            context.fill();
            // Rear right wheel
            context.beginPath();
            context.arc(player.x + 45, player.y + 50, 8, 0, Math.PI * 2, true);
            context.fill();

            // Draw player name in the center of the car
            context.font = "14px Arial";
            context.fillStyle = "white";
            context.textAlign = "center";
            context.fillText(player.name, player.x + 25, player.y - 10);
            // context.fillText(player.name, player.x + 25, player.y + 35); // Nome do jogador no centro do carro
        });
    }, [players]);

    useEffect(() => {
        socket.on('announceWinner', (playerName) => {
            setWinner(playerName);
        });

        return () => {
            socket.off('announceWinner');
        };
    }, []);

    return (
        <div className="flex flex-col items-center justify-center w-full h-full">
            <div className="flex items-center justify-center w-full max-w-4xl">
                <canvas
                    ref={canvasRef}
                    width={300}
                    height={500}
                    className="border-4 border-gray-700 rounded-lg bg-gray-800"
                />
            </div>
            {winner && (
                <div className="mt-4 text-2xl text-white">
                    Vencedor: {winner}
                </div>
            )}
        </div>
    );
}
