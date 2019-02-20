//
//  Shopping.swift
//  ShoppingList
//
//  Created by Shopping List on 2/14/19.
//  Copyright © 2019 Lambda School Labs. All rights reserved.
//
import Foundation

protocol Shopping {

    func groups (completion: @escaping( [Group]?, Error?)-> Void)
    func createGroup (name: String, completion: @escaping (Group? , Error?)-> Void)
    func list(id: Int, completion: @escaping (GroupList? , Error?)-> Void )
    func history(id: Int, completion: @escaping (GroupHistory? , Error?)-> Void )
    func createPurchase (items:[Item], amount: Double, completion: @escaping (GroupList? , Error?)-> Void )
    func invite ( userId:Int, groupId: Int, completion: @escaping (GroupList? , Error?)-> Void )
    func addItem (groupId: Int, item: Item, completion: @escaping (GroupList? , Error?)-> Void )
    func markBought (groupId: Int, itemId: Int, completion: @escaping (GroupList? , Error?)-> Void )
}

struct UserDetail {
    let user: User
    let contribution: Int
}

struct GroupList {
    let group: Group
    let items: [Item]
    let users: [UserDetail]

}

struct Purchase {
    let user: User
    let items: [Item]
    let date: Date
    let amount: Double
}

struct GroupHistory {
    let group: Group
    let purchases: [Purchase]
    let users: [UserDetail]
}
