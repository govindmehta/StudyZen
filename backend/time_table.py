from pydantic import BaseModel, Field
from typing import List
from langchain_core.output_parsers import PydanticOutputParser
from langchain_core.prompts import PromptTemplate
# pydantic models
class format_instr(BaseModel):
    subtopics: List[str] = Field(..., description="List of subtopics to be covered in 7 days")
    day: List[str] = Field(..., description="day")

# prompt
# Schedule generation prompt
schedule_template = """
You are an expert educational planner. Create a 7 day study schedule for the topic: {topic} 
Return the schedule in the format {format_instr}
"""

parser= PydanticOutputParser(pydantic_object=format_instr)
schedule_prompt = PromptTemplate(
    template=schedule_template,
    input_variables=["topic"],
    partial_variables={'format_instr': parser.get_format_instructions()}

)
