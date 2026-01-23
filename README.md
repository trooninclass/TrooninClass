# Revolutionary War Learning Center - Interactive Web App

## 🎓 About This App

This is a fully interactive web-based learning application for 2nd grade ESE students. Students can complete assignments digitally with features like:
- Drawing and writing areas
- Progress tracking
- Save/resume functionality
- Interactive questions
- Student work downloads

## 📁 Files Structure

```
interactive-app/
├── index.html         # Main page (layout and styling)
├── app.js            # App functionality (don't modify)
├── assignments.js    # YOUR ASSIGNMENTS GO HERE
└── README.md         # This file
```

## ✏️ How to Add New Assignments

All your assignments are stored in the `assignments.js` file. You can add new assignments by following these simple templates:

### 📋 Template 1: Multiple Choice / Matching Assignment

```javascript
assignmentName: {
    title: "Your Assignment Title",
    type: "matching",
    instructions: "Instructions for students",
    questions: [
        {
            word: "vocabulary word",
            options: [
                { letter: "A", text: "Option 1", correct: true },
                { letter: "B", text: "Option 2" },
                { letter: "C", text: "Option 3" },
                { letter: "D", text: "Option 4" }
            ]
        }
        // Add more questions here
    ]
}
```

### 📝 Template 2: Short Answer Questions

```javascript
assignmentName: {
    title: "Your Assignment Title",
    type: "short-answer",
    instructions: "Answer each question",
    questions: [
        {
            number: 1,
            text: "Your question here?",
            type: "text"  // Can be "text" or "drawing"
        },
        {
            number: 2,
            text: "Another question?",
            type: "drawing"  // For drawing questions
        }
        // Add more questions
    ]
}
```

### 🔢 Template 3: Math Word Problems

```javascript
assignmentName: {
    title: "Math Assignment Title",
    type: "math",
    instructions: "Solve each problem and show your work",
    questions: [
        {
            number: 1,
            text: "Word problem text here",
            answer: "The answer is _____ [units]."
        }
        // Add more problems
    ]
}
```

### 💭 Template 4: Open-Ended Questions

```javascript
assignmentName: {
    title: "Thinking Questions",
    type: "open-ended",
    instructions: "Share your thoughts",
    questions: [
        {
            number: 1,
            text: "Your question here?",
            hint: "(Optional helper text)",
            prompt: "I think..."
        },
        {
            number: 2,
            text: "Question with choices?",
            options: ["Yes", "No"],  // Optional yes/no buttons
            prompt: "My answer is:"
        },
        {
            number: 3,
            text: "Draw something",
            type: "drawing",
            prompt: "I drew:"
        }
        // Add more questions
    ]
}
```

## 🆕 Step-by-Step: Adding a New Assignment

### Example: Adding a "Civil War" vocabulary assignment

1. Open `assignments.js`
2. Find the closing `};` at the bottom
3. Add a comma after the last assignment
4. Paste this template:

```javascript
    civilWar: {
        title: "Civil War Vocabulary",
        type: "matching",
        instructions: "Match each word with its definition",
        questions: [
            {
                word: "Union",
                options: [
                    { letter: "A", text: "Northern states during the Civil War", correct: true },
                    { letter: "B", text: "Southern states during the Civil War" },
                    { letter: "C", text: "A battle between two sides" },
                    { letter: "D", text: "Freedom from slavery" }
                ]
            },
            {
                word: "Confederacy",
                options: [
                    { letter: "A", text: "Northern states during the Civil War" },
                    { letter: "B", text: "Southern states during the Civil War", correct: true },
                    { letter: "C", text: "A battle between two sides" },
                    { letter: "D", text: "Freedom from slavery" }
                ]
            }
        ]
    }
```

5. Now add the button to `index.html` in the assignment grid section:

```html
<div class="assignment-card vocab" onclick="startAssignment('civilWar')">
    <h3>📚 Civil War Vocabulary</h3>
    <p>Match words about the Civil War</p>
</div>
```

6. Save both files and refresh your browser!

## 🎨 Customizing Button Colors

In `index.html`, find the assignment cards and change their class:
- `.vocab` = Blue gradient
- `.comprehension` = Green gradient
- `.math` = Pink/yellow gradient
- `.thinking` = Teal/purple gradient

Or add your own custom gradient in the `<style>` section!

## 💾 How Student Work is Saved

- **During Work:** Answers save automatically as students type/draw
- **Browser Storage:** Uses localStorage so students can resume if they refresh
- **Download:** Students can download their completed work as a JSON file
- **Teacher Access:** You can view the JSON files to see student responses

## 🖥️ How to Use the App

### For Teachers:
1. Open `index.html` in any web browser
2. Share the file with students (via Google Drive, network folder, USB, etc.)
3. Students open the file and complete assignments
4. Students download their work when finished
5. You review the downloaded JSON files

### For Students:
1. Type your name
2. Click an assignment
3. Answer questions (type or draw)
4. Use "Next" to move forward, "Previous" to go back
5. Click "Finish" when done
6. Download your work to turn in

## 🔧 Technical Notes

- **No Internet Required:** App works completely offline
- **No Installation:** Just open the HTML file in a browser
- **Compatible Browsers:** Chrome, Firefox, Safari, Edge
- **Touch Support:** Works on tablets and touchscreen computers
- **Drawing Feature:** Students can draw with mouse or touch

## 📱 Mobile/Tablet Use

The app is fully responsive and works great on:
- iPads
- Chromebooks
- Android tablets
- Touch-screen laptops

## 🆘 Troubleshooting

**Problem:** Student's name isn't saving
**Solution:** Make sure browser allows localStorage (not in private/incognito mode)

**Problem:** Can't see drawings
**Solution:** Make sure the browser supports HTML5 Canvas (all modern browsers do)

**Problem:** Assignment button doesn't work
**Solution:** Check that the assignment name in `onclick="startAssignment('NAME')"` exactly matches the name in `assignments.js`

## 🎯 Quick Tips

1. **Always test** new assignments before giving to students
2. **Keep question text simple** for 2nd graders
3. **Use sentence starters** (prompts) to help students
4. **Mix question types** to keep students engaged
5. **Save your work** frequently while editing

## 📧 Need Help?

Just ask! I'm here to help you add assignments, fix issues, or add new features to the app.

---

**Version:** 1.0  
**Created for:** ESE 2nd Grade Revolutionary War Unit  
**Last Updated:** January 2026
