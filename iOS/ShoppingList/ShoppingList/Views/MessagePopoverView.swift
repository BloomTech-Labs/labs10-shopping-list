//
//  MessagePopoverView.swift
//  ShoppingList
//
//  Created by Jason Modisett on 2/19/19.
//  Copyright © 2019 Lambda School Labs. All rights reserved.
//

import UIKit

class MessagePopoverView: UIView, NibInstantiatable {
    
    static let nibName: NibName = "MessagePopoverView"
    
    private func updateViews() {
        messageLabel.text = message
    }
    
    @IBAction func okButtonPressed(_ sender: Any) {
        popover.dismiss()
    }
    
    // Types & properties
    var message: String? { didSet { updateViews() }}
    
    // IBOutlets
    @IBOutlet weak var messageLabel: UILabel!
    
}
