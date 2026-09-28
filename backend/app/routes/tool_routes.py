from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.models import Tool
from app.schemas.tool_schema import ToolCreate, ToolUpdate, ToolResponse


router = APIRouter(
    prefix="/api/tools",
    tags=["Tools"]
)


# =========================================================
# Get All Tools
# =========================================================

@router.get("/", response_model=list[ToolResponse])
def get_tools(
    db: Session = Depends(get_db)
):

    tools = db.query(Tool).all()

    return tools


# =========================================================
# Get Specific Tool
# =========================================================

@router.get("/{tool_id}", response_model=ToolResponse)
def get_tool(
    tool_id: str,
    db: Session = Depends(get_db)
):

    tool = db.query(Tool).filter(
        Tool.tool_id == tool_id
    ).first()

    if not tool:
        raise HTTPException(
            status_code=404,
            detail="Tool not found"
        )

    return tool


# =========================================================
# Create New Tool
# =========================================================

@router.post("/", response_model=ToolResponse)
def create_tool(
    tool_data: ToolCreate,
    db: Session = Depends(get_db)
):

    # Check whether Tool ID already exists
    existing_tool = db.query(Tool).filter(
        Tool.tool_id == tool_data.tool_id
    ).first()

    if existing_tool:
        raise HTTPException(
            status_code=400,
            detail="Tool ID already exists"
        )

    # Create new tool
    new_tool = Tool(
        **tool_data.model_dump()
    )

    db.add(new_tool)
    db.commit()
    db.refresh(new_tool)

    return new_tool


# =========================================================
# Update Existing Tool
# =========================================================

@router.put("/{tool_id}", response_model=ToolResponse)
def update_tool(
    tool_id: str,
    tool_data: ToolUpdate,
    db: Session = Depends(get_db)
):

    tool = db.query(Tool).filter(
        Tool.tool_id == tool_id
    ).first()

    if not tool:
        raise HTTPException(
            status_code=404,
            detail="Tool not found"
        )

    # Get only provided fields
    update_data = tool_data.model_dump(
        exclude_unset=True
    )

    # Update tool fields
    for key, value in update_data.items():
        setattr(tool, key, value)

    db.commit()
    db.refresh(tool)

    return tool


# =========================================================
# Delete Tool
# =========================================================

@router.delete("/{tool_id}")
def delete_tool(
    tool_id: str,
    db: Session = Depends(get_db)
):

    tool = db.query(Tool).filter(
        Tool.tool_id == tool_id
    ).first()

    if not tool:
        raise HTTPException(
            status_code=404,
            detail="Tool not found"
        )

    db.delete(tool)
    db.commit()

    return {
        "message": "Tool deleted successfully",
        "tool_id": tool_id
    }


# =========================================================
# Machine & Sensor Monitoring
# =========================================================

@router.get("/{tool_id}/monitoring")
def get_tool_monitoring(
    tool_id: str,
    db: Session = Depends(get_db)
):

    # Find tool
    tool = db.query(Tool).filter(
        Tool.tool_id == tool_id
    ).first()

    if not tool:
        raise HTTPException(
            status_code=404,
            detail="Tool not found"
        )

    return {

        # Tool Information
        "tool_id": tool.tool_id,
        "tool_name": tool.tool_name,

        # Machine Information
        "machine": {
            "machine_id": tool.machine_id
        },

        # Sensor Information
        "sensor_data": {

            "temperature": tool.temperature,

            "vibration": tool.vibration,

            "cutting_force": tool.cutting_force,

            "spindle_speed": tool.spindle_speed,

            "feed_rate": tool.feed_rate,

            "depth_of_cut": tool.depth_of_cut
        },

        # Tool Usage
        "usage": {

            "operating_hours": tool.operating_hours,

            "expected_life": tool.expected_life
        },

        # Current Tool Condition
        "condition": {

            "current_wear": tool.current_wear,

            "status": tool.status,

            "rul": tool.rul
        }
    }