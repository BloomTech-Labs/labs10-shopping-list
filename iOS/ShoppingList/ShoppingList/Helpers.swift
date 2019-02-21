//
//  Helpers.swift
//  ShoppingList
//
//  Created by Jason Modisett on 2/20/19.
//  Copyright © 2019 Lambda School Labs. All rights reserved.
//

import Foundation

func background(_ block: @escaping () -> Void) {
    DispatchQueue.global(qos: .userInteractive).async(execute: block)
}

func UI(_ block: @escaping () -> Void) {
    DispatchQueue.main.async(execute: block)
}
