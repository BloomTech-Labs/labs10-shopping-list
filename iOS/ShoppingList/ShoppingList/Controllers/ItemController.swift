//
//  ItemController.swift
//  ShoppingList
//
//  Created by Nikita Thomas on 2/14/19.
//  Copyright © 2019 Lambda School Labs. All rights reserved.
//

import Foundation


class ItemController {
    
    
    func newItem(withName name: String, category: String, measurement: String, quantity: Int32, price: Double? ) {
        
        guard let item = CoreDataManager.shared.new(Items.self) else {
            // TODO: error creating item
            return
        }
        
        item.name = name
        item.category = category
        item.id = Int32.random(in: Int32.min..<Int32.max)
        item.measurement = measurement
        item.quantity = quantity
        item.updatedAt = Date()
        item.createdAt = Date()
        
        // TODO: Do stuff with price.
        // 1. make sure it's an actual price and not just a double

        
        
        CoreDataManager.shared.save()

    }
    
    
    func getUserID() -> Int32 {
        return Int32(123)
    }
    
    

}
