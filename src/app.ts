import usb from 'usb'
import LightingNodePro from './lightingNodePro'
import * as frames from './frames'


const delay = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}


const run = async():Promise<void> =>{
    let devices = usb.getDeviceList();
    let foundDevices = devices.filter(d => {
        return d.deviceDescriptor.idVendor === 0x1b1c
    });

    const deviceControllers = []

    for (let index = 0; index < foundDevices.length; index++) {
        const device = foundDevices[index]
        let name: string
        let fans: number
        if(device.deviceDescriptor.idProduct === 3083){
            name = 'Lighting Node Pro'
            
            fans = 3
        }else if(device.deviceDescriptor.idProduct === 3097){
            name = 'H100i RGB'
            fans = 2
        }
        console.log(`Found ${name}`);
        const controller =  new LightingNodePro(device,name);
        await controller.initialize(fans, false, false);
        if(!controller.outEndpoint) continue
        let sigIntCnt = 0;
        controller.devices.forEach(dev => dev.eventStack = [frames.blankFrame])
        deviceControllers.push(controller)
    }

    let counter = 0
    if(deviceControllers.length > 0){
        while(1){
            await deviceControllers[counter].loop()
            await delay(10000/deviceControllers.length)
            counter ++
            if(counter === deviceControllers.length){
                counter = 0
            }
        }
    }
}


run()