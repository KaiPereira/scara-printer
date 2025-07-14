
# Double Arm Scara 3D Floor Printer

This scara printer uses a double arm system and a drive train to be able to print in XYZ and utilize the floor as a bed to create a cost-effective, efficient printer. This printer was built for undercity, a 4 day hackathon by @lordbagel42, @vibsthebot and @KaiPereira.

[**PHOTO OF PRINTER HERE***]

## Custom Features

- Double scara arm giving X and Y movement
- 2 wheel drivetrain which gives movement on the Z, and allows it to print in an infinitely large area
- 3D pen for the extruder/hotend giving an economical and cool way to print
- Support for the Manta M8P V1.1 and Nema 17 motors

## Cad Design

The entire design was built in Onshape by all three of us, the drivetrain is the fundamental part and uses weight to hold up the scara and 3D pen, the 3D pen is then held in using a mount and we use bearings and nema 17's for everything else. The entire project was also 3D printed aside from the electronics, screws, bearings, etc.

![Pasted image 20250713154933.png](images/Pasted%20image%2020250713154933.png)
![Pasted image 20250713155026.png](images/Pasted%20image%2020250713155026.png)
![Pasted image 20250713155046.png](images/Pasted%20image%2020250713155046.png)

## Electronics

The printer uses many different electronics, and we went through many, many iterations. We used NEMA 17's for our steppers, servo's for small functionality like extruding, 9V to power the thing, and a Manta M8P V1.1 for the mainboard.

[**PHOTO OF ELECTRONICS HERE***]

## Firmware

The scara printer uses heavily customized Marlin firmware to make the system work. We went through many different types of firmware, Marlin, grblHAL, custom, FluidNC, all of it, because we didn't have the necessary hardware to make something *normal*.

## Bill of Materials (BOM)

Here's the materials you need to build this printer:
- A LOT of PLA filament
- 4x NEMA 17 stepper motors
- 7x Ball Bearings
- 9V Batteries
- 1x Manta M8P V1.1 board
- 1x SG90 servo
- Lots of wires
- Assortment of screws and bolts

