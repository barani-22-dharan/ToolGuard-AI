from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.models import Tool


router = APIRouter(
    prefix="/api/maintenance",
    tags=["Maintenance & Alerts"]
)


# =========================================================
# Maintenance & Alert Information
# =========================================================

@router.get("/{tool_id}")
def get_maintenance_status(
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

    # Determine maintenance recommendation
    if tool.current_wear <= 40:
        maintenance_status = "No Immediate Maintenance Required"
        recommendation = "Tool is operating normally. Continue monitoring."

    elif tool.current_wear <= 75:
        maintenance_status = "Maintenance Recommended"
        recommendation = "Schedule tool inspection and maintenance soon."

    else:
        maintenance_status = "Immediate Maintenance Required"
        recommendation = "Stop or replace the tool and perform maintenance."

    # Determine alert level
    if tool.current_wear <= 40:
        alert_level = "Normal"

    elif tool.current_wear <= 75:
        alert_level = "Warning"

    else:
        alert_level = "Critical"

    return {

        "tool_id": tool.tool_id,

        "tool_name": tool.tool_name,

        "machine_id": tool.machine_id,

        "current_condition": {
            "wear_percentage": tool.current_wear,
            "status": tool.status,
            "rul": tool.rul
        },

        "maintenance": {
            "last_maintenance": tool.last_maintenance,
            "maintenance_status": maintenance_status,
            "recommendation": recommendation
        },

        "alert": {
            "level": alert_level,
            "message": recommendation
        }
    }