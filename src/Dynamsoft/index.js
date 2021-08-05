// import Dynamsoft from 'dwt'
// import { ProductKey } from '../../public/dynamsoft.webtwain.config'

// Dynamsoft.WebTwainEnv.ResourcesPath = '../../public/'

let DWObject = {}
// async function init() {
//     console.log('start init DWObject !')
//     Dynamsoft.WebTwainEnv.Trial = true;
//     Dynamsoft.WebTwainEnv.ProductKey = ProductKey
//     Dynamsoft.WebTwainEnv.RegisterEvent('OnWebTwainReady', async () => {
//         console.log('MaterialExtract ready.......')
//         DWObject = Dynamsoft.WebTwainEnv.GetWebTwain('dwtcontrolContainer')
//         if (DWObject) {
//             DWObject.IfDisableSourceAfterAcquire = true
//             DWObject.ImageCaptureDriverType = 0
//             DWObject.IfShowProgressBar = true
//             DWObject.IfShowCancelDialogWhenImageTransfer = false
//             DWObject.IfShowUI = false
//         }
//     })
    
//     await Dynamsoft.WebTwainEnv.Load()
// }

export async function getDWObject () {
    // if (!DWObject) {
    //     await init()
    // }
    return DWObject
}
