//
//  History.swift
//  ShoppingList
//
//  Created by Yvette Zhukovsky on 2/27/19.
//  Copyright © 2019 Lambda School Labs. All rights reserved.
//

import Foundation

struct HistoryList: Codable {
    let data: [[History]]
}

struct History: Codable {
    let total: Double?
    let item: HistoryItem?
    let name, user, date: String?
    let grandTotal: Double?
    
    init(item: Item) {
        self.total = item.price
        self.item = HistoryItem(item: item)
        self.name = item.name
        self.user = userName
        self.date = Date().dateToString()
        self.grandTotal = item.price
    }
}

struct HistoryItem: Codable {
    let id: Int
    let name, user: String
    let price: Double
    
    init(item: Item) {
        self.id = item.id ?? 0
        self.name = item.name
        self.user = userName
        self.price = item.price
    }
}
