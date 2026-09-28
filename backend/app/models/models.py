from sqlalchemy import Column, Integer, String, Float, Date
from app.database.database import Base


class Tool(Base):
    __tablename__ = "tools"

    id = Column(Integer, primary_key=True, index=True)

    # Basic Tool Information
    tool_id = Column(String, unique=True, index=True, nullable=False)
    tool_name = Column(String, nullable=False)
    tool_type = Column(String)
    manufacturer = Column(String)
    material = Column(String)

    # Machine Information
    machine_id = Column(String)

    # Tool Usage
    operating_hours = Column(Float, default=0)
    expected_life = Column(Float, default=100)

    # AI Prediction Data
    current_wear = Column(Float, default=0)
    rul = Column(Float, default=100)
    status = Column(String, default="Normal")

    # Sensor Data
    temperature = Column(Float, default=25)
    vibration = Column(Float, default=0)
    cutting_force = Column(Float, default=0)
    spindle_speed = Column(Float, default=0)
    feed_rate = Column(Float, default=0)
    depth_of_cut = Column(Float, default=0)

    # Maintenance
    last_maintenance = Column(Date, nullable=True)

    # Tool Lifecycle
    lifecycle_stage = Column(
        String,
        default="Tool Created"
    )

    # Installation
    installation_date = Column(Date, nullable=True)