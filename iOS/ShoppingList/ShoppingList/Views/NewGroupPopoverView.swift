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
        groupNameTextField.becomeFirstResponder()
    }
    
    @IBAction func addGroup(_ sender: Any) {
        guard let groupName = groupNameTextField.text else { return }

        GroupController.shared.newGroup(withName: groupName) { (group) in
            guard let group = group else { return }
            allGroups.append(group)
            selectedGroup = group
            self.delegate?.updatesNeeded()
            popover.dismiss()
        }
    }
    
    @IBOutlet weak var groupNameTextField: UITextField!
    
}
