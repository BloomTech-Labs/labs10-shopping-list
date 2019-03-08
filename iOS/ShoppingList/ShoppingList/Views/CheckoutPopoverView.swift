//
//  CheckoutPopoverView.swift
//  ShoppingList
//
//  Created by Jason Modisett on 3/7/19.
//  Copyright © 2019 Lambda School Labs. All rights reserved.
//

import UIKit

class CheckoutPopoverView: UIView, NibInstantiatable {
    
    static let nibName: NibName = "CheckoutPopoverView"
    weak var delegate: PopoverViewDelegate?
    var items: [Item] = [] { didSet { updateViews() }}
    
    override func awakeFromNib() {
        super.awakeFromNib()
        priceField.becomeFirstResponder()
    }
    
    private func updateViews() {
        let checkoutText = items.count == 1 ? "CHECKOUT \(items.count) ITEM" : "CHECKOUT \(items.count) ITEMS"
        checkoutLabel.text = checkoutText
    }
    
    @IBAction func checkoutPressed(_ sender: Any) {
        guard let total = priceField.text else { return }
        ItemController.shared.checkout(items: items, withTotal: Double(total) ?? 0) { (_) in
            self.delegate?.updatesNeeded()
            popover.dismiss()
        }
    }

    
    @IBOutlet weak var checkoutLabel: UILabel!
    @IBOutlet weak var priceField: UITextField!
    
}
