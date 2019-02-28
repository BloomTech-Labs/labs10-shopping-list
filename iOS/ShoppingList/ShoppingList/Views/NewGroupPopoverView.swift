//
//  NewGroupPopoverView.swift
//  ShoppingList
//
//  Created by Jason Modisett on 2/28/19.
//  Copyright © 2019 Lambda School Labs. All rights reserved.
//

import UIKit

class NewGroupPopoverView: UIView, NibInstantiatable {
    
    static let nibName: NibName = "NewGroupPopoverView"
    weak var delegate: PopoverViewDelegate?
    
    override func awakeFromNib() {
        super.awakeFromNib()
        
    }
    
    @IBAction func addGroup(_ sender: Any) {
        guard let groupName = groupNameTextField.text else { return }
        
        
    }
    
    @IBOutlet weak var groupNameTextField: UITextField!
    
}
