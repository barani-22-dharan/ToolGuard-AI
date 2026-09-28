from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database.database import get_db
from app.models.models import Tool


router = APIRouter(
    prefix="/api/lifecycle",
    tags=["PLM Tool Lifecycle"]
)


# =========================================================
# Lifecycle Stages
# =========================================================

LIFECYCLE_STAGES = [
    "Tool Created",
    "Approved",
    "Installed",
    "In Use",
    "Wear Monitoring",
    "AI Prediction",
    "Maintenance",
    "Reuse",
    "Replacement",
    "Retired"
]


# =========================================================
# Lifecycle Update Request
# =========================================================

class LifecycleUpdate(BaseModel):
    lifecycle_stage: str


# =========================================================
# Get Tool Lifecycle
# =========================================================

@router.get("/{tool_id}")
def get_tool_lifecycle(
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

    current_stage_index = LIFECYCLE_STAGES.index(
        tool.lifecycle_stage
    ) if tool.lifecycle_stage in LIFECYCLE_STAGES else 0

    return {
        "tool_id": tool.tool_id,
        "tool_name": tool.tool_name,
        "current_stage": tool.lifecycle_stage,
        "stage_number": current_stage_index + 1,
        "total_stages": len(LIFECYCLE_STAGES),
        "lifecycle_stages": LIFECYCLE_STAGES
    }


# =========================================================
# Update Tool Lifecycle
# =========================================================

@router.put("/{tool_id}")
def update_tool_lifecycle(
    tool_id: str,
    data: LifecycleUpdate,
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

    if data.lifecycle_stage not in LIFECYCLE_STAGES:
        raise HTTPException(
            status_code=400,
            detail={
                "message": "Invalid lifecycle stage",
                "allowed_stages": LIFECYCLE_STAGES
            }
        )

    tool.lifecycle_stage = data.lifecycle_stage

    db.commit()
    db.refresh(tool)

    return {
        "message": "Tool lifecycle updated successfully",
        "tool_id": tool.tool_id,
        "tool_name": tool.tool_name,
        "current_stage": tool.lifecycle_stage
    }