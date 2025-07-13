
# Double Arm Scara 3D Floor Printer

This scara printer uses a double arm system and a drive train to be able to print in XYZ and utilize the floor as a bed to create a cost-effective, efficient printer. This printer was built for undercity, a 4 day hackathon by @lordbagel42, @vibsthebot and @KaiPereira.

[**PHOTO OF PRINTER HERE***]

## Custom Features

- Double scara arm giving X and Y movement
- 2 wheel drivetrain which gives movement on the Z, and allows it to print in an infinitely large area
- 3D pen for the extruder/hotend giving an economical and cool way to print
- Support for the ESP32 and Nema 17 motors

## Cad Design

The entire design was built in Onshape by all three of us, the drivetrain is the fundamental part and uses weight to hold up the scara and 3D pen, the 3D pen is then held in using a mount and we use bearings and nema 17's for everything else. The entire project was also 3D printed aside from the electronics, screws, bearings, etc.

![[Pasted image 20250713154933.png]]
![[Pasted image 20250713155026.png]]
![[Pasted image 20250713155046.png]]

## Electronics

The printer uses many different electronics, and we went through many, many iterations. We used NEMA 17's for our steppers, servo's for small functionality like extruding, TMC2209 drivers to run the steppers, an ESP32 for our brains, and a hole lotta wires.

[**PHOTO OF ELECTRONICS HERE***]

## Firmware

The scara printer uses heavily customized Marlin firmware to make the system work. We went through nearly 4 different types of firmware, grblHAL, custom, FluidNC, all of it, because we didn't have the necessary hardware to make something *normal*.

## Bill of Materials (BOM)

