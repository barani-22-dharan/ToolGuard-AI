from pydantic import BaseModel
from typing import Optional
from datetime import date


class ToolBase(BaseModel):
    tool_id: str
    tool_name: str
    tool_type: Optional[str] = None
    manufacturer: Optional[str] = None
    material: Optional[str] = None

    machine_id: Optional[str] = None

    operating_hours: float = 0
    expected_life: float = 100

    current_wear: float = 0
    rul: float = 100
    status: str = "Normal"

    temperature: float = 25
    vibration: float = 0
    cutting_force: float = 0
    spindle_speed: float = 0
    feed_rate: float = 0
    depth_of_cut: float = 0

    last_maintenance: Optional[date] = None
    lifecycle_stage: str = "Tool Created"
    installation_date: Optional[date] = None


class ToolCreate(ToolBase):
    pass


class ToolUpdate(BaseModel):
    tool_name: Optional[str] = None
    tool_type: Optional[str] = None
    manufacturer: Optional[str] = None
    material: Optional[str] = None
    machine_id: Optional[str] = None

    operating_hours: Optional[float] = None
    expected_life: Optional[float] = None
    current_wear: Optional[float] = None
    rul: Optional[float] = None
    status: Optional[str] = None

    temperature: Optional[float] = None
    vibration: Optional[float] = None
    cutting_force: Optional[float] = None
    spindle_speed: Optional[float] = None
    feed_rate: Optional[float] = None
    depth_of_cut: Optional[float] = None

    last_maintenance: Optional[date] = None
    lifecycle_stage: Optional[str] = None
    installation_date: Optional[date] = None


class ToolResponse(ToolBase):
    id: int

    class Config:
        from_attributes = True
        
        