//
//  NewItemPopoverView.swift
//  ShoppingList
//
//  Created by Jason Modisett on 2/28/19.
//  Copyright © 2019 Lambda School Labs. All rights reserved.
//

import UIKit

class NewItemPopoverView: UIView, NibInstantiatable {
    
    static let nibName: NibName = "NewItemPopoverView"
    weak var delegate: PopoverViewDelegate?
    var isPurchased = false
    
    override func awakeFromNib() {
        super.awakeFromNib()
        itemName.becomeFirstResponder()
    }
    
    @IBAction func addItemPressed(_ sender: Any) {
        guard let name = itemName.text else { return }
        
        guard let selectedGroup = selectedGroup else { return }
        let newItem = Item(name: name, measurement: nil, purchased: false, price: 0, quantity: 0, group: selectedGroup)
        ItemController.shared.saveItem(item: newItem) { (_, _) in
            self.delegate?.updatesNeeded()
            popover.dismiss()
        }
    }
    
    @IBOutlet weak var itemName: UITextField!
    
}
