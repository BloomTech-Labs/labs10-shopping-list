//
//  ManageGroupsTableViewController.swift
//  ShoppingList
//
//  Created by Jason Modisett on 2/19/19.
//  Copyright © 2019 Lambda School Labs. All rights reserved.
//

import UIKit

// Yes I know this is a view controller instead of table view controller
// it's just temporarily a regular view controller because reasons
class ManageGroupsTableViewController: UIViewController {
    
    // MARK: - IBActions
    
    @IBAction func doneButtonPressed(_ sender: Any) {
        dismiss(animated: true, completion: nil)
    }
    
}
