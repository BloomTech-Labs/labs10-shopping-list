//
//  Helpers.swift
//  ShoppingList
//
//  Created by Nikita Thomas on 2/21/19.
//  Copyright © 2019 Lambda School Labs. All rights reserved.
//

import Foundation


extension String {
    func stringToDate() -> Date {
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "E, d MMM yyyy HH:mm:ss Z"
        
        return dateFormatter.date(from: self)!
    }
}

extension Date {
    func dateToString() -> String {
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "E, d MMM yyyy HH:mm:ss Z"
        return dateFormatter.string(from: self)
    }
}

extension UIImage {
    
    func resized(withPercentage percentage: CGFloat) -> UIImage? {
        let canvasSize = CGSize(width: size.width * percentage, height: size.height * percentage)
        UIGraphicsBeginImageContextWithOptions(canvasSize, false, scale)
        defer { UIGraphicsEndImageContext() }
        draw(in: CGRect(origin: .zero, size: canvasSize))
        return UIGraphicsGetImageFromCurrentImageContext()
    }
    
    func resizeToDatabaseSize() -> UIImage? {
        guard let imageData = self.pngData() else { return nil }
        
        var resizingImage = self
        var imageSizeKB = Double(imageData.count) / 1000.0
        
        while imageSizeKB > 2048 {
            guard let resizedImage = resizingImage.resized(withPercentage: 0.9),
                let imageData = resizedImage.pngData()
                else { return nil }
            
            resizingImage = resizedImage
            imageSizeKB = Double(imageData.count) / 1000.0
        }
        
        return resizingImage
    }
    
}
