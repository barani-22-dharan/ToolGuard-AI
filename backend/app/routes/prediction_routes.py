from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database.database import get_db
from app.models.models import Tool
from app.ml.wear_prediction import calculate_wear


router = APIRouter(
    prefix="/api/predict",
    tags=["AI Prediction"]
)


# =========================================================
# Manual Wear Prediction Request
# =========================================================

class WearPredictionRequest(BaseModel):
    operating_hours: float
    temperature: float
    vibration: float
    cutting_force: float


# =========================================================
# Tool-Based AI Wear Prediction
# =========================================================

@router.get("/wear/{tool_id}")
def predict_tool_wear(
    tool_id: str,
    db: Session = Depends(get_db)
):

    # Find tool from database
    tool = db.query(Tool).filter(
        Tool.tool_id == tool_id
    ).first()

    if not tool:
        raise HTTPException(
            status_code=404,
            detail="Tool not found"
        )

    # Calculate AI-based tool wear
    result = calculate_wear(
        operating_hours=tool.operating_hours,
        temperature=tool.temperature,
        vibration=tool.vibration,
        cutting_force=tool.cutting_force
    )

    # Update prediction data
    tool.current_wear = result["predicted_wear"]
    tool.status = result["status"]

    # Calculate RUL
    tool.rul = max(
        0,
        tool.expected_life - tool.operating_hours
    )

    # Save changes
    db.commit()
    db.refresh(tool)

    return {
        "message": "Tool wear prediction completed",

        "tool_id": tool.tool_id,

        "tool_name": tool.tool_name,

        "prediction": {
            "predicted_wear": result["predicted_wear"],
            "status": result["status"],
            "rul": tool.rul
        },

        "sensor_data": {
            "operating_hours": tool.operating_hours,
            "temperature": tool.temperature,
            "vibration": tool.vibration,
            "cutting_force": tool.cutting_force,
            "spindle_speed": tool.spindle_speed,
            "feed_rate": tool.feed_rate,
            "depth_of_cut": tool.depth_of_cut
        }
    }


# =========================================================
# RUL Prediction
# =========================================================

@router.get("/rul/{tool_id}")
def predict_tool_rul(
    tool_id: str,
    db: Session = Depends(get_db)
):

    # Find tool from database
    tool = db.query(Tool).filter(
        Tool.tool_id == tool_id
    ).first()

    if not tool:
        raise HTTPException(
            status_code=404,
            detail="Tool not found"
        )

    # Calculate Remaining Useful Life
    rul = max(
        0,
        tool.expected_life - tool.operating_hours
    )

    # Determine RUL condition
    if rul > tool.expected_life * 0.5:
        condition = "Healthy"

    elif rul > tool.expected_life * 0.2:
        condition = "Warning"

    else:
        condition = "Critical"

    # Update RUL in database
    tool.rul = rul

    # Save changes
    db.commit()
    db.refresh(tool)

    return {
        "message": "RUL prediction completed",

        "tool_id": tool.tool_id,

        "tool_name": tool.tool_name,

        "rul_prediction": {
            "expected_life": tool.expected_life,
            "operating_hours": tool.operating_hours,
            "remaining_useful_life": rul,
            "condition": condition
        }
    }


# =========================================================
# Manual AI Wear Prediction
# =========================================================

@router.post("/wear")
def predict_wear(
    data: WearPredictionRequest
):

    result = calculate_wear(
        operating_hours=data.operating_hours,
        temperature=data.temperature,
        vibration=data.vibration,
        cutting_force=data.cutting_force
    )

    return {
        "message": "Tool wear prediction completed",

        "prediction": result
    }