

import UIKit
import AVFoundation
import Alamofire

class BarcodeScannerController: UIViewController, StoryboardInstantiatable {
    
    static let storyboardName: StoryboardName = "BarcodeScannerController"
    
    @IBOutlet var messageLabel:UILabel!
    @IBOutlet var headerView: UIView!
    
    var captureSession = AVCaptureSession()
    var videoPreviewLayer: AVCaptureVideoPreviewLayer?
    var qrCodeFrameView: UIView?
    let Api_key = "93t3qvktlhhpxvkpyau8etocbsda14"
    
    
    private let supportedCodeTypes = [AVMetadataObject.ObjectType.upce,
                                      AVMetadataObject.ObjectType.code39,
                                      AVMetadataObject.ObjectType.code39Mod43,
                                      AVMetadataObject.ObjectType.code93,
                                      AVMetadataObject.ObjectType.code128,
                                      AVMetadataObject.ObjectType.ean8,
                                      AVMetadataObject.ObjectType.ean13,
                                      AVMetadataObject.ObjectType.aztec,
                                      AVMetadataObject.ObjectType.pdf417,
                                      AVMetadataObject.ObjectType.itf14,
                                      AVMetadataObject.ObjectType.dataMatrix,
                                      AVMetadataObject.ObjectType.interleaved2of5,
                                      AVMetadataObject.ObjectType.qr]
    
    override func viewDidLoad() {
        super.viewDidLoad()
       
        // Get the back-facing camera for capturing videos
        let deviceDiscoverySession = AVCaptureDevice.DiscoverySession(deviceTypes: [.builtInDualCamera], mediaType: AVMediaType.video, position: .back)
        
        guard let captureDevice = deviceDiscoverySession.devices.first else {
            print("Failed to get the camera device")
            return
        }
        
        do {
            // Get an instance of the AVCaptureDeviceInput class using the previous device object.
            let input = try AVCaptureDeviceInput(device: captureDevice)
            
            // Set the input device on the capture session.
            captureSession.addInput(input)
            
            // Initialize a AVCaptureMetadataOutput object and set it as the output device to the capture session.
            let captureMetadataOutput = AVCaptureMetadataOutput()
            captureSession.addOutput(captureMetadataOutput)
            
            // Set delegate and use the default dispatch queue to execute the call back
            captureMetadataOutput.setMetadataObjectsDelegate(self, queue: DispatchQueue.main)
            captureMetadataOutput.metadataObjectTypes = supportedCodeTypes
            //            captureMetadataOutput.metadataObjectTypes = [AVMetadataObject.ObjectType.qr]
            
        } catch {
            // If any error occurs, simply print it out and don't continue any more.
            print(error)
            return
        }
        
        // Initialize the video preview layer and add it as a sublayer to the viewPreview view's layer.
        videoPreviewLayer = AVCaptureVideoPreviewLayer(session: captureSession)
        videoPreviewLayer?.videoGravity = AVLayerVideoGravity.resizeAspectFill
        videoPreviewLayer?.frame = view.layer.bounds
        view.layer.addSublayer(videoPreviewLayer!)
        
        // Start video capture.
        captureSession.startRunning()
        
        // Move the message label and top bar to the front
        view.bringSubviewToFront(messageLabel)
        view.bringSubviewToFront(headerView)
        
        // Initialize QR Code Frame to highlight the QR code
        qrCodeFrameView = UIView()
        
        if let qrCodeFrameView = qrCodeFrameView {
            qrCodeFrameView.layer.borderColor = UIColor.green.cgColor
            qrCodeFrameView.layer.borderWidth = 2
            view.addSubview(qrCodeFrameView)
            view.bringSubviewToFront(qrCodeFrameView)
        }
    }
    
    
    enum BarcodeError: Error {
        case failedToConstructURL
        case requestFailed(err: String)
        case invalidResponse
        case noProductsFound
    }

    struct BarcodeResponse: Codable {
        let products: [Product]
    }
    
    struct Product: Codable {
        let product_name: String
    }
    
    func getProductName(barcode: String, completion: @escaping (String?, Error?) -> Void) {
        var ucs = URLComponents(string: "https://api.barcodelookup.com/v2/products")
        ucs?.queryItems = [
            URLQueryItem(name: "key", value: "2w4ia6ph7zd6vxytlojkeisu66eqtm"),
            URLQueryItem(name: "barcode", value: barcode)
        ]
        
        let url: URL?
        do {
            try url = ucs?.asURL()
        } catch {
            completion(nil, BarcodeError.failedToConstructURL)
            return
        }
        
        if url == nil {
            completion(nil, BarcodeError.failedToConstructURL)
            return
        }
        
    
        Alamofire.request(url!, method: .post, encoding: JSONEncoding.default).validate().responseData { (response) in
            
            switch response.result {
            case .success(let value):
                
                do {
                    let decoder = JSONDecoder()
                    let br = try decoder.decode(BarcodeResponse.self, from: value)
                    if br.products.count == 0 {
                        completion(nil, BarcodeError.noProductsFound)
                        return
                    }
                    completion(br.products[0].product_name, nil)
                    return
                } catch {
                    print("Could not turn json into user\(error)")
                    completion(nil, error)
                    return
                }
                
            case .failure(let error):
                completion(nil, BarcodeError.requestFailed(err: error.localizedDescription))
                return
            }
        }
        
    }
    
    @IBAction func closeButtonPressed(_ sender: Any) {
        self.delegate?.updatesNeeded()
        dismiss(animated: true, completion: nil)
    }
    
 
    private var done = false
    weak var delegate: PopoverViewDelegate?
}

extension BarcodeScannerController: AVCaptureMetadataOutputObjectsDelegate {
   
    
    func metadataOutput(_ output: AVCaptureMetadataOutput, didOutput metadataObjects: [AVMetadataObject], from connection: AVCaptureConnection) {
        if done { return }
        // Check if the metadataObjects array is not nil and it contains at least one object.
        if metadataObjects.count == 0 {
            qrCodeFrameView?.frame = CGRect.zero
            messageLabel.text = "No QR code is detected"
            return
        }
        
        // Get the metadata object.
        let metadataObj = metadataObjects[0] as! AVMetadataMachineReadableCodeObject
        
        if supportedCodeTypes.contains(metadataObj.type) {
            // If the found metadata is equal to or barcode then update the status label's text and set the bounds
            let barCodeObject = videoPreviewLayer?.transformedMetadataObject(for: metadataObj)
            qrCodeFrameView?.frame = barCodeObject!.bounds
            
            if let barcode = metadataObj.stringValue {
                done = true
                getProductName(barcode: barcode) {
                    (productName, err) in
                    
                    if let err = err {
                        NSLog("failed to get product name for barcode=\(barcode): \(err)")
                    }
                    
                   // self.captureSession.stopRunning()
                    guard let name = productName else { return }
                    
                    guard let selectedGroup = selectedGroup else { return }
                    let newItem = Item(name: name, measurement: nil, purchased: false, price: 0, quantity: 0, group: selectedGroup)
                    ItemController.shared.saveItem(item: newItem) { (_, _) in
                        
                    }
                
                }
                let storyboard = UIStoryboard(name: "MainViewController", bundle: nil)
                let mainVC = storyboard.instantiateInitialViewController() ??
                    MainViewController.instantiate()
                self.delegate?.updatesNeeded()
                self.present(mainVC, animated: true, completion: nil)
                
                
            }
        }
    }
    
}
