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
        updateButton()
        itemName.becomeFirstResponder()
    }
    
    private func updateButton() {
        if isPurchased {
            isPurchased = false
            purchasedButton.setTitle("Purchased!", for: .normal)
        } else {
            isPurchased = true
            purchasedButton.setTitle("Not purchased", for: .normal)
        }
    }
    
    @IBAction func purchasedPressed(_ sender: Any) {
        updateButton()
    }
    
    @IBAction func addItemPressed(_ sender: Any) {
        guard let name = itemName.text,
              let amount = amountField.text,
            let price = priceField.text else { return }
        
        guard let selectedGroup = selectedGroup else { return }
        let newItem = Item(name: name, measurement: nil, purchased: false, price: Double(Int(price) ?? 0), quantity: Int(amount) ?? 0, group: selectedGroup)
        ItemController.shared.saveItem(item: newItem) { (_, _) in
            self.delegate?.updatesNeeded()
            popover.dismiss()
        }
    }
    
    @IBOutlet weak var itemName: UITextField!
    @IBOutlet weak var amountField: UITextField!
    @IBOutlet weak var priceField: UITextField!
    @IBOutlet weak var purchasedButton: UIButton!
    
}
