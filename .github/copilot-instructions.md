<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

This project is a Vite + p5.js educational game. The main logic is in `src/main.js`. The game is a two-player tug-of-war where each player answers their own randomly generated multiple-choice math questions. The player who answers correctly first gets more pulling force on their side of the rope. When the rope's center crosses a threshold, that player wins.

Each round of question is generated with a random math operation (addition, subtraction, multiplication, or division) and four possible answers. Players must select the correct answer to gain pulling force. The game tracks the pulling force for each player and updates the rope's position accordingly.

A round ends when a correct answrer is selected, or both players chooses wrong answers, or a timer runs out. The timer for each round should be 8 seconds. The timer should be visible during each round. The game continues until one player's pulling force causes the rope's center to cross a defined threshold, resulting in that player winning the game.

If a player selects a wrong answer for their question, they lose pulling force and cannot select another answer until their opponent chooses an answers. The game is designed to be educational, focusing on math skills while providing a fun and competitive experience.

The force applied on the rope is continuous and the rope should move towards the side with more force. This forces players to answer quickly to avoid losing based on momentum.

When a wrong answer is selected, their should be a visual indication (like a red flash and sound) to signal the incorrect choice, and the player should not be able to select another answer until their opponent has made a choice. Similarly, when a correct answer is selected, there should be a visual indication (like a green flash and sound) to signal the correct choice.
