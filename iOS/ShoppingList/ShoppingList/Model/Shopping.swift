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
    func createPurchase (items:[Items], amount: Double, completion: @escaping (GroupList? , Error?)-> Void )
    func invite ( userId:Int, groupId: Int, completion: @escaping (GroupList? , Error?)-> Void )
    func addItem (groupId: Int, item: Items, completion: @escaping (GroupList? , Error?)-> Void )
    func markBought (groupId: Int, itemId: Int, completion: @escaping (GroupList? , Error?)-> Void )
    //func billing(completion: @escaping( [Group]?, Error?)-> Void)
}

struct UserDetail {
    let user: Users
    let contribution: Int
}

struct GroupList {
    let group: Group
    let items: [Items]
    let users: [UserDetail]
    
}

struct Purchase {
    let user: Users
    let items: [Items]
    let date: Date
    let amount: Double
}

struct GroupHistory {
    let group: Group
    let purchases: [Purchase]
    let users: [UserDetail]
}

// XXX: why are items plural here?
