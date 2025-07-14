
# Double Arm Scara 3D Floor Printer

This scara printer uses a double arm system and a drive train to be able to print in XYZ and utilize the floor as a bed to create a cost-effective, efficient printer. This printer was built for undercity, a 4 day hackathon by @lordbagel42, @vibsthebot and @KaiPereira.

![Pasted image 20250714064541.png](images/Pasted%20image%2020250714064541.png)

## Custom Features

- Double scara arm giving X and Y movement
- 2 wheel drivetrain which gives movement on the Z, and allows it to print in an infinitely large area
- 3D pen for the extruder/hotend giving an economical and cool way to print
- Support for Seeed XIAO RP2040 and Nema 17 motors
- Cost effective and simple design

## Cad Design

The entire design was built in Onshape by all three of us, the drivetrain is the fundamental part and uses weight to hold up the scara and 3D pen, the 3D pen is then held in using a mount and we use bearings and nema 17's for everything else. The entire project was also 3D printed aside from the electronics, screws, bearings, etc.

![Pasted image 20250713154933.png](images/Pasted%20image%2020250713154933.png)
![Pasted image 20250713155026.png](images/Pasted%20image%2020250713155026.png)
![Pasted image 20250713155046.png](images/Pasted%20image%2020250713155046.png)

## Electronics

The printer uses many different electronics, and we went through many, many iterations. We used NEMA 17's for our steppers, servo's for small functionality like extruding, a USB PD for power delivery, and a Seeed XIAO RP2040 for the mainboards.

![Pasted image 20250714064618.png](images/Pasted%20image%2020250714064618.png)

## Firmware

The scara printer uses a **fully custom** slicer that will convert a drawing into circuit python script. We went through many different types of firmware, Marlin, grblHAL, custom, FluidNC, all of it, because we didn't have the necessary hardware to make something *normal*. And then in the end, we decided that we really just had to make something custom.

## Bill of Materials (BOM)

Here's the materials you need to build this printer:
- A LOT of PLA filament
- 4x NEMA 17 stepper motors
- 7x Ball Bearings
- 2x Seeed XIAO RP2040
- 4x Proto-PIC A4988 Stepper Motor Driver
- 2x Blot Boards
- 1x Blot USB-PD up to 20V
- 1x SG90 servo
- Lots of wires
- Assortment of screws and bolts

