import google.generativeai as genai
import graphviz

genai.configure(api_key="YOUR_GEMINI_API_KEY")

def get_steps_from_gemini(task):
    model = genai.GenerativeModel("gemini-pro")
    prompt = f"Provide a step-by-step process to perform: '{task}'. Return the steps in a numbered list format."
    
    response = model.generate_content(prompt)
    steps = response.text.split("\n")  
    steps = [step.strip() for step in steps if step.strip() and step[0].isdigit()]  
    return [s.split(". ", 1)[-1] for s in steps]  

def generate_flowchart(task):
    steps = get_steps_from_gemini(task)

    dot = graphviz.Digraph(format="png")
    dot.attr(rankdir="TB", size="10")  
    dot.node("start", "Start", shape="ellipse", style="filled", fillcolor="lightgray")

    for i, step in enumerate(steps):
        dot.node(f"step{i}", step, shape="box", style="filled", fillcolor="lightblue")

    dot.node("end", "End", shape="ellipse", style="filled", fillcolor="lightgray")

    dot.edge("start", "step0")
    for i in range(len(steps) - 1):
        dot.edge(f"step{i}", f"step{i+1}")
    dot.edge(f"step{len(steps)-1}", "end")

    return dot

# Example usage
task = "How to bake a cake"
flowchart = generate_flowchart(task)
flowchart.render("flowchart", format="png", cleanup=True)
