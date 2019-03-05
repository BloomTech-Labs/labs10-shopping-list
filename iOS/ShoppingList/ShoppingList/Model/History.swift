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
}

struct HistoryItem: Codable {
    let id: Int
    let name, user: String
    let price: Double
}
