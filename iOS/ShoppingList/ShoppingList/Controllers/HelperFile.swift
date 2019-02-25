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
