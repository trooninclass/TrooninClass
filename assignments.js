// ASSIGNMENTS DATA FILE - TROONIN'S CLASS
// Organized by category: news2you, uniquelearning, attainment
// When adding new assignments, tell me which category and I'll create the code for you!

const categories = {
    news2you: {
        name: "News 2 You",
        description: "Current events and news activities",
        assignments: {
            // WINTER OLYMPICS 2026 UNIT
            
            winterOlympicsStory: {
                title: "Winter Olympics - Interactive Story",
                category: "News 2 You",
                type: "interactive-story",
                instructions: "Read along with the story! Click the arrows to turn pages. Click the speaker to hear each page read aloud.",
                pages: [
                    {
                        number: 1,
                        text: "A big sports event is February 6-22. The event is the 2026 Winter Olympic Games. The 2026 Winter Olympics is in northern Italy. Italy is a country in southern Europe. Many of the Winter Olympic competitions will be in Milan, Italy. Competitions will be in Cortina d'Ampezzo, Italy, too.",
                        image: "🏔️",
                        imageDesc: "Map of Italy with Olympic rings"
                    },
                    {
                        number: 2,
                        text: "The Winter Olympics are every four years. Athletes from around the world compete in winter sports. Many countries send athletes to the Winter Olympics. The countries include the U.S., China, Denmark, South Korea, and more. More than 3,500 athletes will compete this year.",
                        image: "🌍",
                        imageDesc: "Athletes from different countries"
                    },
                    {
                        number: 3,
                        text: "The Winter Olympics starts with an opening ceremony. The opening ceremony is on February 6. The athletes will march in a parade. People from Italy will perform for the athletes. A special Olympic flag will be raised.",
                        image: "🎭",
                        imageDesc: "Opening ceremony celebration"
                    },
                    {
                        number: 4,
                        text: "Athletes may compete on teams or by themselves. They compete on ice and snow. The Winter Olympics will include 16 winter sports. The sports include alpine skiing, bobsleigh, curling, figure skating, ice hockey, snowboarding, and speed skating.",
                        image: "⛷️",
                        imageDesc: "Winter sports montage"
                    },
                    {
                        number: 5,
                        text: "The Winter Olympics will include one new sport this year. The sport is named ski mountaineering. Ski mountaineering is a skiing sport. Athletes ski and climb up a mountain.",
                        image: "🏔️",
                        imageDesc: "Ski mountaineering athlete"
                    },
                    {
                        number: 6,
                        text: "Athletes wear special covers on their skis. The covers help them not slide down the mountain. They take the covers off at the top of the mountain. Then the athletes ski down the mountain.",
                        image: "⛷️",
                        imageDesc: "Skier with climbing skins"
                    },
                    {
                        number: 7,
                        text: "The best athletes in the Winter Olympics win medals. An athlete wins a gold medal for first place, silver medal for second place, and bronze medal for third place. The Winter Olympics will end with a closing ceremony. The closing ceremony is on February 22.",
                        image: "🥇",
                        imageDesc: "Olympic medals"
                    },
                    {
                        number: 8,
                        text: "Many people will go to Italy to watch the Winter Olympics. Many more people will watch the Winter Olympics on TV. People will cheer for their favorite athletes. Some athletes may set new world records! Will you watch the Winter Olympics?",
                        image: "📺",
                        imageDesc: "People watching Olympics"
                    }
                ]
            },
            
            winterOlympicsVocab: {
                title: "Winter Olympics - Vocabulary",
                category: "News 2 You",
                type: "matching",
                instructions: "Match each word with its definition. Choose the correct letter for each word.",
                questions: [
                    {
                        word: "Olympics",
                        options: [
                            { letter: "A", text: "A big sports event where athletes from many countries compete", correct: true },
                            { letter: "B", text: "A person who competes in sports" },
                            { letter: "C", text: "A country in southern Europe" },
                            { letter: "D", text: "A special ceremony at the beginning" }
                        ]
                    },
                    {
                        word: "athletes",
                        options: [
                            { letter: "A", text: "A big sports event where athletes from many countries compete" },
                            { letter: "B", text: "A person who competes in sports", correct: true },
                            { letter: "C", text: "A country in southern Europe" },
                            { letter: "D", text: "A special ceremony at the beginning" }
                        ]
                    },
                    {
                        word: "Italy",
                        options: [
                            { letter: "A", text: "A big sports event where athletes from many countries compete" },
                            { letter: "B", text: "A person who competes in sports" },
                            { letter: "C", text: "A country in southern Europe", correct: true },
                            { letter: "D", text: "A special ceremony at the beginning" }
                        ]
                    },
                    {
                        word: "ceremony",
                        options: [
                            { letter: "A", text: "A big sports event where athletes from many countries compete" },
                            { letter: "B", text: "A person who competes in sports" },
                            { letter: "C", text: "A country in southern Europe" },
                            { letter: "D", text: "A special ceremony at the beginning", correct: true }
                        ]
                    },
                    {
                        word: "medals",
                        options: [
                            { letter: "A", text: "Awards given to the best athletes - gold, silver, and bronze", correct: true },
                            { letter: "B", text: "A sport where you ski up and down a mountain" },
                            { letter: "C", text: "Sports played on ice and snow" },
                            { letter: "D", text: "When athletes walk in a line to show their country" }
                        ]
                    },
                    {
                        word: "ski mountaineering",
                        options: [
                            { letter: "A", text: "Awards given to the best athletes - gold, silver, and bronze" },
                            { letter: "B", text: "A sport where you ski up and down a mountain", correct: true },
                            { letter: "C", text: "Sports played on ice and snow" },
                            { letter: "D", text: "When athletes walk in a line to show their country" }
                        ]
                    },
                    {
                        word: "winter sports",
                        options: [
                            { letter: "A", text: "Awards given to the best athletes - gold, silver, and bronze" },
                            { letter: "B", text: "A sport where you ski up and down a mountain" },
                            { letter: "C", text: "Sports played on ice and snow", correct: true },
                            { letter: "D", text: "When athletes walk in a line to show their country" }
                        ]
                    },
                    {
                        word: "parade",
                        options: [
                            { letter: "A", text: "Awards given to the best athletes - gold, silver, and bronze" },
                            { letter: "B", text: "A sport where you ski up and down a mountain" },
                            { letter: "C", text: "Sports played on ice and snow" },
                            { letter: "D", text: "When athletes walk in a line to show their country", correct: true }
                        ]
                    }
                ]
            },

            winterOlympicsComprehension: {
                title: "Winter Olympics - Reading Questions",
                category: "News 2 You",
                type: "short-answer",
                instructions: "Answer each question about the Winter Olympics story.",
                questions: [
                    {
                        number: 1,
                        text: "When do the 2026 Winter Olympics start?",
                        type: "text"
                    },
                    {
                        number: 2,
                        text: "What country will have the 2026 Winter Olympics?",
                        type: "text"
                    },
                    {
                        number: 3,
                        text: "How often do the Winter Olympics happen?",
                        type: "text"
                    },
                    {
                        number: 4,
                        text: "Name two winter sports mentioned in the story.",
                        type: "text"
                    },
                    {
                        number: 5,
                        text: "What is the new sport in the 2026 Winter Olympics?",
                        type: "text"
                    },
                    {
                        number: 6,
                        text: "What medal do you win for first place?",
                        type: "text"
                    }
                ]
            },

            winterOlympicsStorySequence: {
                title: "Winter Olympics - Beginning, Middle, End",
                category: "News 2 You",
                type: "story-sequence",
                instructions: "Tell what happens at the beginning, middle, and end of the Winter Olympics.",
                questions: [
                    {
                        number: 1,
                        text: "What happens at the BEGINNING of the Winter Olympics?",
                        prompt: "At the beginning:",
                        type: "text"
                    },
                    {
                        number: 2,
                        text: "What happens in the MIDDLE of the Winter Olympics?",
                        prompt: "In the middle:",
                        type: "text"
                    },
                    {
                        number: 3,
                        text: "What happens at the END of the Winter Olympics?",
                        prompt: "At the end:",
                        type: "text"
                    }
                ]
            },

            winterOlympicsCoordinatePlane: {
                title: "Winter Olympics - Coordinate Plane",
                category: "News 2 You",
                type: "coordinate-plane",
                instructions: "Click on the coordinate plane to plot the Olympic medals! Follow the directions for each question.",
                questions: [
                    {
                        number: 1,
                        text: "Plot a GOLD medal at coordinates (2, 3)",
                        correctX: 2,
                        correctY: 3,
                        medalType: "gold"
                    },
                    {
                        number: 2,
                        text: "Plot a SILVER medal at coordinates (4, 1)",
                        correctX: 4,
                        correctY: 1,
                        medalType: "silver"
                    },
                    {
                        number: 3,
                        text: "Plot a BRONZE medal at coordinates (1, 5)",
                        correctX: 1,
                        correctY: 5,
                        medalType: "bronze"
                    },
                    {
                        number: 4,
                        text: "Plot a GOLD medal at coordinates (5, 5)",
                        correctX: 5,
                        correctY: 5,
                        medalType: "gold"
                    },
                    {
                        number: 5,
                        text: "Plot a SILVER medal at coordinates (3, 2)",
                        correctX: 3,
                        correctY: 2,
                        medalType: "silver"
                    }
                ]
            },

            winterOlympicsMoney: {
                title: "Winter Olympics - Olympic Tickets Money",
                category: "News 2 You",
                type: "money-interactive",
                instructions: "Drag coins and bills to show the correct amount of money for Olympic tickets!",
                questions: [
                    {
                        number: 1,
                        text: "An Olympic ticket costs $5. Show $5 using bills and coins.",
                        targetAmount: 5.00
                    },
                    {
                        number: 2,
                        text: "Two tickets cost $10. Show $10 using bills and coins.",
                        targetAmount: 10.00
                    },
                    {
                        number: 3,
                        text: "A special ticket costs $3.50. Show $3.50 using bills and coins.",
                        targetAmount: 3.50
                    },
                    {
                        number: 4,
                        text: "A family ticket costs $20. Show $20 using bills and coins.",
                        targetAmount: 20.00
                    },
                    {
                        number: 5,
                        text: "A student ticket costs $2.75. Show $2.75 using bills and coins.",
                        targetAmount: 2.75
                    }
                ]
            }
        }
    },
    
    uniquelearning: {
        name: "Unique Learning",
        description: "Subject lessons and units",
        assignments: {
            // REVOLUTIONARY WAR UNIT
            revolutionaryWarVocab: {
                title: "Revolutionary War - Vocabulary",
                category: "Unique Learning",
                type: "matching",
                instructions: "Match each word with its definition. Choose the correct letter for each word.",
                questions: [
                    {
                        word: "colonists",
                        options: [
                            { letter: "A", text: "People who lived in the 13 Colonies in America", correct: true },
                            { letter: "B", text: "The 13 areas in America where people from Great Britain lived" },
                            { letter: "C", text: "Rules that people must follow" },
                            { letter: "D", text: "People who fight in battles during wars" }
                        ]
                    },
                    {
                        word: "Colonies",
                        options: [
                            { letter: "A", text: "People who lived in the 13 Colonies in America" },
                            { letter: "B", text: "The 13 areas in America where people from Great Britain lived", correct: true },
                            { letter: "C", text: "Rules that people must follow" },
                            { letter: "D", text: "People who fight in battles during wars" }
                        ]
                    },
                    {
                        word: "laws",
                        options: [
                            { letter: "A", text: "People who lived in the 13 Colonies in America" },
                            { letter: "B", text: "The 13 areas in America where people from Great Britain lived" },
                            { letter: "C", text: "Rules that people must follow", correct: true },
                            { letter: "D", text: "People who fight in battles during wars" }
                        ]
                    },
                    {
                        word: "soldiers",
                        options: [
                            { letter: "A", text: "People who lived in the 13 Colonies in America" },
                            { letter: "B", text: "The 13 areas in America where people from Great Britain lived" },
                            { letter: "C", text: "Rules that people must follow" },
                            { letter: "D", text: "People who fight in battles during wars", correct: true }
                        ]
                    },
                    {
                        word: "Revolutionary War",
                        options: [
                            { letter: "A", text: "The war between the Colonies and Great Britain that lasted seven years", correct: true },
                            { letter: "B", text: "Fights between soldiers during a war" },
                            { letter: "C", text: "Damaged or broken so badly that it cannot be used anymore" },
                            { letter: "D", text: "When people decide together on something and both sides accept it" }
                        ]
                    },
                    {
                        word: "battles",
                        options: [
                            { letter: "A", text: "The war between the Colonies and Great Britain that lasted seven years" },
                            { letter: "B", text: "Fights between soldiers during a war", correct: true },
                            { letter: "C", text: "Damaged or broken so badly that it cannot be used anymore" },
                            { letter: "D", text: "When people decide together on something and both sides accept it" }
                        ]
                    },
                    {
                        word: "destroyed",
                        options: [
                            { letter: "A", text: "The war between the Colonies and Great Britain that lasted seven years" },
                            { letter: "B", text: "Fights between soldiers during a war" },
                            { letter: "C", text: "Damaged or broken so badly that it cannot be used anymore", correct: true },
                            { letter: "D", text: "When people decide together on something and both sides accept it" }
                        ]
                    },
                    {
                        word: "agreement",
                        options: [
                            { letter: "A", text: "The war between the Colonies and Great Britain that lasted seven years" },
                            { letter: "B", text: "Fights between soldiers during a war" },
                            { letter: "C", text: "Damaged or broken so badly that it cannot be used anymore" },
                            { letter: "D", text: "When people decide together on something and both sides accept it", correct: true }
                        ]
                    },
                    {
                        word: "free",
                        options: [
                            { letter: "A", text: "Not controlled by another country or person", correct: true },
                            { letter: "B", text: "Papers with stories about what is happening in the country and world" },
                            { letter: "C", text: "People who fight in battles during wars" },
                            { letter: "D", text: "Rules that people must follow" }
                        ]
                    },
                    {
                        word: "newspapers",
                        options: [
                            { letter: "A", text: "Not controlled by another country or person" },
                            { letter: "B", text: "Papers with stories about what is happening in the country and world", correct: true },
                            { letter: "C", text: "People who fight in battles during wars" },
                            { letter: "D", text: "Rules that people must follow" }
                        ]
                    }
                ]
            },

            revolutionaryWarComprehension: {
                title: "Revolutionary War - Reading Questions",
                category: "Unique Learning",
                type: "short-answer",
                instructions: "Answer each question. Write your answer in the box.",
                questions: [
                    {
                        number: 1,
                        text: "Who lived in the 13 Colonies?",
                        type: "text"
                    },
                    {
                        number: 2,
                        text: "The colonists did not like the laws. Yes or No?",
                        type: "text"
                    },
                    {
                        number: 3,
                        text: "How many years did the war last?",
                        type: "text"
                    },
                    {
                        number: 4,
                        text: "Were the Colonies free after the war? Yes or No?",
                        type: "text"
                    },
                    {
                        number: 5,
                        text: "Circle the places where soldiers fought: fields, forests, cities, oceans",
                        type: "text",
                        hint: "Type the correct places separated by commas"
                    },
                    {
                        number: 6,
                        text: "Draw a picture of something that happened in the war.",
                        type: "drawing"
                    }
                ]
            },

            revolutionaryWarMath: {
                title: "Revolutionary War - Math Problems",
                category: "Unique Learning",
                type: "math",
                instructions: "Read each problem. Show your work in the drawing area. Write your answer in the box.",
                questions: [
                    {
                        number: 1,
                        text: "There were 13 Colonies in America. The king made 48 new laws for the Colonies. Then he made 37 more laws. How many laws did the king make in all?",
                        answer: "The king made _____ laws in all."
                    },
                    {
                        number: 2,
                        text: "During the war, 156 soldiers came to one Colony. Later, 89 more soldiers came. How many soldiers were in the Colony?",
                        answer: "There were _____ soldiers in the Colony."
                    },
                    {
                        number: 3,
                        text: "A newspaper printed 218 papers about the war. People bought 165 of them. How many newspapers were left?",
                        answer: "There were _____ newspapers left."
                    },
                    {
                        number: 4,
                        text: "The colonists had 273 homes before the war. During the war, 128 homes were destroyed. How many homes were not destroyed?",
                        answer: "_____ homes were not destroyed."
                    },
                    {
                        number: 5,
                        text: "There were 142 battles in fields and 87 battles in forests. How many battles were there in all?",
                        answer: "There were _____ battles in all."
                    },
                    {
                        number: 6,
                        text: "The war lasted 7 years. After the war, there were 264 soldiers. Then 139 soldiers went home. How many soldiers stayed?",
                        answer: "_____ soldiers stayed."
                    }
                ]
            },

            revolutionaryWarThinking: {
                title: "Revolutionary War - Thinking Questions",
                category: "Unique Learning",
                type: "open-ended",
                instructions: "Answer the questions. You can draw or write.",
                questions: [
                    {
                        number: 1,
                        text: "How do we learn about news today in 2026?",
                        hint: "(TV, computer, phone, newspaper)",
                        prompt: "I learn news from:"
                    },
                    {
                        number: 2,
                        text: "The colonists wanted to make their own rules. Do you help make rules at school or home?",
                        options: ["Yes", "No"],
                        prompt: "I help make rules when:"
                    },
                    {
                        number: 3,
                        text: "Wars hurt people. What is a better way to solve problems?",
                        prompt: "A better way is to:"
                    },
                    {
                        number: 4,
                        text: "Draw something we have today in 2026 that they did not have during the Revolutionary War.",
                        type: "drawing",
                        prompt: "I drew a:"
                    },
                    {
                        number: 5,
                        text: "If you could talk to someone from the Revolutionary War, what would you tell them about 2026?",
                        prompt: "I would tell them:"
                    }
                ]
            }
        }
    },
    
    attainment: {
        name: "Attainment",
        description: "Skills and practice activities",
        assignments: {
            // Attainment assignments will be added here as you create them
        }
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = categories;
}
