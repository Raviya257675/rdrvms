import unittest
from validate_pack import check_required, check_ids, check_openapi

class DocumentationContractTests(unittest.TestCase):
    def test_required_manifest(self):
        self.assertEqual(check_required(), [])
    def test_traceability(self):
        self.assertEqual(check_ids(), [])
    def test_draft_openapi_shape(self):
        self.assertEqual(check_openapi(), [])

if __name__ == '__main__': unittest.main()
