//
//  Double.swift
//  ShoppingList
//
//  Created by Jason Modisett on 3/7/19.
//  Copyright © 2019 Lambda School Labs. All rights reserved.
//

import Foundation

extension Double {
    
    func toCurrency() -> String {
        let formatter = NumberFormatter()
        formatter.numberStyle = .currency
        return formatter.string(from: self as NSNumber) ?? ""
    }
    
}
