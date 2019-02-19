//
//  Networking+helper.swift
//  ShoppingList
//
//  Created by Nikita Thomas on 2/19/19.
//  Copyright © 2019 Lambda School Labs. All rights reserved.
//

import Foundation
import CoreData

// Turns coreData objects into JSON for networking
extension NSManagedObject {
    func toJSON() -> [String: Any]? {
        let keys = Array(self.entity.attributesByName.keys)
        let dict = self.dictionaryWithValues(forKeys: keys)
        do {
            let jsonData = try JSONSerialization.data(withJSONObject: dict, options: [])
            let jsonDict = try JSONSerialization.jsonObject(with: jsonData, options: []) as? [String: Any]
//            let JSONStr = String(data: jsonData, encoding: .utf8)
            return jsonDict
        } catch {
            return nil
        }
    }
}
