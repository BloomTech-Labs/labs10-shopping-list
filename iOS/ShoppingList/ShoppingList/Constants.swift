//
//  Constants.swift
//  ShoppingList
//
//  Created by Jason Modisett on 2/14/19.
//  Copyright © 2019 Lambda School Labs. All rights reserved.
//

import Foundation
import Popover

var allGroups: [Group] = []
var selectedGroup: Group? = nil
var history: [Item] = []

// MARK: - Popovers

let screen = UIScreen.main.bounds

var popover: Popover = {
    let popover = Popover(options: [.animationIn(0.275),
                                    .animationOut(0.2),
                                    .cornerRadius(14),
                                    .color(UIColor(named: "Background") ?? .clear),
                                    .blackOverlayColor(UIColor(named: "PopoverBackground") ?? .clear),
                                    .arrowSize(CGSize(width: 0.1, height: 0.1)),
                                    .initialSpringVelocity(CGFloat(0.2)),
                                    .springDamping(CGFloat(0.92))],
                          showHandler: nil,
                          dismissHandler: nil)
    
    popover.layer.shadowOpacity = 0.4
    popover.layer.shadowOffset = CGSize(width: 0, height: 3)
    popover.layer.shadowRadius = 7
    popover.layer.opacity = 1
    
    return popover
}()

struct Popovers {
    
    // Message Popover
    static func triggerMessagePopover(with message: String) {
        let popoverView = MessagePopoverView.instantiate()
        popoverView.message = message
        popoverView.frame = CGRect(x: 20, y: 0, width: screen.width - 40, height: 230)
        let startPoint = CGPoint(x: screen.width / 2, y: (screen.height / 2) - 115)
        popover.show(popoverView, point: startPoint)
    }
    
    static func triggerGroupsPopover(_ delegate: PopoverViewDelegate) {
        let popoverView = GroupsPopoverView.instantiate()
        popoverView.delegate = delegate
        popoverView.frame = CGRect(x: 20, y: 0, width: screen.width - 40, height: 320)
        let startPoint = CGPoint(x: screen.width / 2, y: (screen.height / 2) - 160)
        popover.show(popoverView, point: startPoint)
    }
    
    static func triggerNewGroupPopover(_ delegate: PopoverViewDelegate) {
        let popoverView = NewGroupPopoverView.instantiate()
        popoverView.delegate = delegate
        popoverView.frame = CGRect(x: 20, y: 0, width: screen.width - 40, height: 160)
        let startPoint = CGPoint(x: screen.width / 2, y: (screen.height / 2) - 200)
        popover.show(popoverView, point: startPoint)
    }
    
    static func triggerNewItemPopover(_ delegate: PopoverViewDelegate) {
        let popoverView = NewItemPopoverView.instantiate()
        popoverView.delegate = delegate
        popoverView.frame = CGRect(x: 20, y: 0, width: screen.width - 40, height: 320)
        let startPoint = CGPoint(x: screen.width / 2, y: (screen.height / 2) - 300)
        popover.show(popoverView, point: startPoint)
    }
    
}
