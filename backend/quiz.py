from pydantic import BaseModel, Field, model_validator
from typing import List,Literal,Optional
from langchain_core.output_parsers import PydanticOutputParser
from langchain_core.prompts import PromptTemplate

class format_instr(BaseModel):
    ques: List[str] = Field(..., description="List of questions")
    ans: List[str] = Field(..., description="List of answers")
    options: List[List[str]] = Field(..., description="List of options for each question")


quiz_template = """
You are an expert .Provide mcq on {subtopic} .
as per format {format_instr}
"""

parser= PydanticOutputParser(pydantic_object=format_instr)
quiz_prompt = PromptTemplate(
    input_variables=["subtopic"],
    template=quiz_template,
    partial_variables={'format_instr': parser.get_format_instructions()}
)
