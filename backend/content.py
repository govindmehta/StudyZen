from pydantic import BaseModel, Field, model_validator
from typing import List,Literal,Optional
from langchain_core.output_parsers import PydanticOutputParser
from langchain_core.prompts import PromptTemplate

class format_instr(BaseModel):
    content: str = Field(..., description="The explanation of the subtopic")
    examples: str = Field( description="Examples to illustrate the concepts")
    analogies: str = Field(description="Analogies to simplify complex ideas") 
    code_example: str = Field(description="Code examples ")
    keywords: List[str] = Field(description="Important 4-5 keywords from explanation")
    summary: str = Field(description="3 point Summary of the content")


content_template = """
You are an expert .Provide a detailed explanation of the subtopic {subtopic} .

Your explanation should:
1. Start with a clear, concise definition
2. Explain key concepts in simple, accessible language
3. Use relevant examples to illustrate complex ideas
4. Include analogies where appropriate
5. Include code examples if the topic is technical
6. Highlight important terms or concepts

Your explanation should be in format {format_instr}
"""

parser= PydanticOutputParser(pydantic_object=format_instr)
content_prompt = PromptTemplate(
    input_variables=["subtopic"],
    template=content_template,
    partial_variables={'format_instr': parser.get_format_instructions()}
)
